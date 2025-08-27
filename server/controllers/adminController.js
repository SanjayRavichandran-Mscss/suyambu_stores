const db = require('../config/db');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const IMAGE_BASE = "http://localhost:5000";

// Add new category
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const sql = `INSERT INTO categories (name, description, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`;
    const [result] = await db.query(sql, [name, description || null]);

    return res.status(201).json({ message: 'Category added successfully', id: result.insertId });
  } catch (error) {
    console.error('Error adding category:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const [existing] = await db.query('SELECT id FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const sql = `UPDATE categories SET name = ?, description = ?, updated_at = NOW() WHERE id = ?`;
    await db.query(sql, [name, description || null, id]);

    return res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT id FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await db.query('DELETE FROM categories WHERE id = ?', [id]);

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// View all categories
exports.viewCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY created_at DESC');
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to parse additional_images
const parseAdditionalImages = (images) => {
  try {
    if (!images) {
      return [];
    }
    if (Array.isArray(images)) {
      return images.map((img) =>
        img && img.startsWith("/") ? `${IMAGE_BASE}${img}` : img
      );
    }
    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) {
          return parsed.map((img) =>
            img && img.startsWith("/") ? `${IMAGE_BASE}${img}` : img
          );
        }
      } catch {
        return images
          .split(",")
          .map((img) => img.trim())
          .filter((img) => img)
          .map((img) => (img.startsWith("/") ? `${IMAGE_BASE}${img}` : img));
      }
    }
    return [];
  } catch (error) {
    console.error("Error parsing additional_images:", error, images);
    return [];
  }
};

// Helper function to stringify additional_images
const stringifyAdditionalImages = (imagesArray) => {
  if (!Array.isArray(imagesArray)) return '[]';
  return JSON.stringify(imagesArray);
};

// Multer storage for product images
const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/productImages");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-"));
  },
});

const productUpload = multer({
  storage: productImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype.toLowerCase());
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
}).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "additional_images", maxCount: 5 },
]);

// Add new product
exports.addProduct = [
  productUpload,
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        stock_quantity,
        category_id,
      } = req.body;

      if (!name || !price || !stock_quantity || !category_id) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      let thumbnail_url = null;
      let additional_images = [];

      if (req.files) {
        if (req.files.thumbnail && req.files.thumbnail.length > 0) {
          thumbnail_url = `/productImages/${req.files.thumbnail[0].filename}`;
        }
        if (req.files.additional_images && req.files.additional_images.length > 0) {
          additional_images = req.files.additional_images.map(
            (file) => `/productImages/${file.filename}`
          );
        }
      }

      const sql = `
        INSERT INTO products 
        (name, description, price, stock_quantity, thumbnail_url, additional_images, category_id, admin_id, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const [result] = await db.query(sql, [
        name,
        description || null,
        price,
        stock_quantity,
        thumbnail_url,
        stringifyAdditionalImages(additional_images),
        category_id,
        1,
      ]);

      return res.status(201).json({ message: "Product added successfully", id: result.insertId });
    } catch (error) {
      console.error("Error adding product:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
];

// Update product by ID
exports.updateProduct = [
  productUpload,
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        price,
        stock_quantity,
        category_id,
        existing_additional_images,
      } = req.body;

      // Check if product exists
      const [existing] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
      if (existing.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      const product = existing[0];

      // Prepare update fields
      const updateFields = {};
      if (name) updateFields.name = name;
      if (description !== undefined) updateFields.description = description || null;
      if (price) updateFields.price = price;
      if (stock_quantity) updateFields.stock_quantity = stock_quantity;
      if (category_id) updateFields.category_id = category_id;

      let thumbnail_url = product.thumbnail_url;
      let additional_images = [];

      // Parse existing_additional_images from request body
      let retainedImages = [];
      if (existing_additional_images) {
        try {
          retainedImages = typeof existing_additional_images === 'string'
            ? JSON.parse(existing_additional_images)
            : existing_additional_images;
        } catch (error) {
          console.error("Error parsing existing_additional_images:", error);
          retainedImages = [];
        }
      }

      // Get current images from DB
      const currentImages = parseAdditionalImages(product.additional_images);

      // Delete images that are no longer in retainedImages
      const imagesToDelete = currentImages.filter(
        img => !retainedImages.includes(img)
      );
      imagesToDelete.forEach((img) => {
        const filePath = path.join(
          __dirname,
          '../public',
          img.replace(IMAGE_BASE, '')
        );
        fs.unlink(filePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error deleting additional image:', err);
          }
        });
      });

      // Handle new images
      if (req.files && req.files.additional_images && req.files.additional_images.length > 0) {
        additional_images = req.files.additional_images.map(
          (file) => `/productImages/${file.filename}`
        );
      }

      // Combine retained and new images
      additional_images = [...retainedImages, ...additional_images];

      if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
        thumbnail_url = `/productImages/${req.files.thumbnail[0].filename}`;
        if (product.thumbnail_url) {
          const thumbnailPath = path.join(
            __dirname,
            '../public',
            product.thumbnail_url.replace(IMAGE_BASE, '')
          );
          fs.unlink(thumbnailPath, (err) => {
            if (err && err.code !== 'ENOENT') {
              console.error('Error deleting old thumbnail:', err);
            }
          });
        }
      }

      updateFields.thumbnail_url = thumbnail_url;
      updateFields.additional_images = stringifyAdditionalImages(additional_images);

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: "No fields provided for update" });
      }

      const sql = `
        UPDATE products SET 
          ${Object.keys(updateFields).map((key) => `${key} = ?`).join(', ')},
          updated_at = NOW()
        WHERE id = ?
      `;
      const values = [...Object.values(updateFields), id];

      await db.query(sql, values);

      return res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
];

// Delete product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query("SELECT id FROM products WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const [product] = await db.query("SELECT thumbnail_url, additional_images FROM products WHERE id = ?", [id]);
    if (product.length > 0) {
      if (product[0].thumbnail_url) {
        const thumbnailPath = path.join(
          __dirname,
          '../public',
          product[0].thumbnail_url.replace(IMAGE_BASE, '')
        );
        fs.unlink(thumbnailPath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error deleting thumbnail:', err);
          }
        });
      }
      const additionalImages = parseAdditionalImages(product[0].additional_images);
      additionalImages.forEach((img) => {
        const filePath = path.join(
          __dirname,
          '../public',
          img.replace(IMAGE_BASE, '')
        );
        fs.unlink(filePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error deleting additional image:', err);
          }
        });
      });
    }

    await db.query("DELETE FROM products WHERE id = ?", [id]);

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// View all products
exports.viewProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM products ORDER BY created_at DESC`);

    const parsedRows = rows.map((product) => ({
      ...product,
      thumbnail_url: product.thumbnail_url?.startsWith("/")
        ? `${IMAGE_BASE}${product.thumbnail_url}`
        : product.thumbnail_url || "",
      additional_images: parseAdditionalImages(product.additional_images),
    }));

    return res.status(200).json(parsedRows);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};