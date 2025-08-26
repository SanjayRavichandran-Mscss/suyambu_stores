const db = require('../config/db');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

    // Check if category exists
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

    // Check if category exists
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
const parseAdditionalImages = (imagesData) => {
  if (!imagesData) return [];
  
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(imagesData);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    // If JSON parsing fails, handle as comma-separated string
    if (typeof imagesData === 'string') {
      return imagesData.split(',').map(img => img.trim()).filter(img => img);
    }
  }
  return [];
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
    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // unique filename: timestamp-originalname
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-"));
  },
});

const productUpload = multer({
  storage: productImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max file size
  fileFilter: (req, file, cb) => {
    // Accept only image files
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

      // Simple validations
      if (!name || !price || !stock_quantity || !category_id) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Handle images
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

      // Insert into DB
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
        1, // static admin_id as per instruction
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
      } = req.body;

      if (!name || !price || !stock_quantity || !category_id) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if product exists
      const [existing] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
      if (existing.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      const product = existing[0];

      let thumbnail_url = product.thumbnail_url;
      let additional_images = parseAdditionalImages(product.additional_images);

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
        UPDATE products SET 
          name = ?, description = ?, price = ?, stock_quantity = ?,
          thumbnail_url = ?, additional_images = ?, category_id = ?, updated_at = NOW() 
        WHERE id = ?
      `;

      await db.query(sql, [
        name,
        description || null,
        price,
        stock_quantity,
        thumbnail_url,
        stringifyAdditionalImages(additional_images),
        category_id,
        id,
      ]);

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

    // Check if product exists
    const [existing] = await db.query("SELECT id FROM products WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Optionally: delete images from filesystem here if needed
    const [product] = await db.query("SELECT thumbnail_url, additional_images FROM products WHERE id = ?", [id]);
    if (product.length > 0) {
      if (product[0].thumbnail_url) {
        fs.unlink(path.join(__dirname, '../public', product[0].thumbnail_url), (err) => {
          if (err) console.error('Error deleting thumbnail:', err);
        });
      }
      
      const additionalImages = parseAdditionalImages(product[0].additional_images);
      additionalImages.forEach((img) => {
        fs.unlink(path.join(__dirname, '../public', img), (err) => {
          if (err) console.error('Error deleting additional image:', err);
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
    
    // Parse additional_images using our helper function
    const parsedRows = rows.map(product => ({
      ...product,
      additional_images: parseAdditionalImages(product.additional_images)
    }));
    
    return res.status(200).json(parsedRows);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};