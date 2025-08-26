-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: suyambu_stores
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `street` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `zip_code` varchar(20) NOT NULL,
  `country` varchar(100) DEFAULT 'India',
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'Navaneeth_kgcas','12345678','admin@gmail.com','Navaneeth M','2025-08-26 03:41:50','2025-08-26 03:41:50');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cart` (`customer_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (3,'Oils','Our oils are 100% pure, cold-pressed, and chemical-free, extracted using traditional wooden churner (marachekku/ghani) methods to retain natural nutrients. Whether you’re looking for groundnut oil, sesame oil, coconut oil, or castor oil, every bottle carries the essence of homemade care. Unlike refined and factory-made oils, our oils are rich in antioxidants, vitamins, and essential fatty acids that boost immunity, improve digestion, and enhance skin and hair health. Perfect for everyday cooking and Ayurvedic purposes, these oils maintain authentic taste and freshness. Every drop is prepared with hygiene and love, ensuring you and your family enjoy wholesome goodness. Ideal for traditional cooking, frying, or even for body massage therapies, our oils bring back the heritage of purity to your kitchen. Switch to natural oils today and rediscover the authentic flavors of homemade cooking.','2025-08-26 06:39:00','2025-08-26 06:39:00'),(4,'Fruits','Our fruits are freshly handpicked directly from local farms without any chemical ripening agents or artificial preservatives. We believe in delivering seasonal fruits that are naturally grown, sun-ripened, and full of nutrients. From juicy mangoes, sweet bananas, and tangy oranges to rare traditional fruits like custard apples and guavas, every bite is a taste of nature’s bounty. Packed carefully to retain freshness, our fruits not only satisfy your sweet cravings but also enrich your diet with vitamins, fiber, and antioxidants. We avoid long cold-storage methods and instead focus on quick farm-to-home delivery, making sure you enjoy freshness just as nature intended. Our promise is simple – fruits that taste just like they are plucked straight from the orchard. Whether for daily snacking, gifting, or juice-making, our fruits are the healthier, tastier, and more natural choice for you and your loved ones.','2025-08-26 06:39:24','2025-08-26 06:39:24'),(5,'Vegetables','Experience the goodness of farm-fresh vegetables grown naturally without harmful pesticides or artificial fertilizers. Every vegetable we deliver comes directly from trusted local farmers, ensuring top-notch quality, freshness, and taste. From leafy greens like spinach and curry leaves to root vegetables such as carrots, potatoes, and beetroots, we bring everything your kitchen needs. Our focus is on chemical-free farming and minimal handling to preserve nutrients. These vegetables not only cook faster but also taste richer compared to store-bought ones. Perfect for everyday curries, stir-fries, or traditional recipes, our vegetables make your meals more wholesome and healthy. We also offer rare native vegetables like drumstick, bitter gourd, ridge gourd, and brinjal that revive traditional food habits. Eating natural vegetables daily improves immunity, digestion, and overall wellness. With our fresh supply, your kitchen will always be stocked with nutritious and tasty ingredients that remind you of homegrown produce.','2025-08-26 06:39:46','2025-08-26 06:39:46'),(6,'Spices','Our spices are freshly ground, aromatic, and made from naturally grown ingredients without chemical additives. We bring you a wide range including turmeric, chili powder, coriander powder, cumin, pepper, cardamom, and more – all processed traditionally to retain their natural oils and fragrance. Unlike store-bought polished powders, our spices are pure and free from artificial colors or flavor enhancers. Every pinch adds a burst of flavor, aroma, and authenticity to your dishes. Sourced from trusted farmers and sun-dried before grinding, these spices also hold medicinal properties used in Ayurveda for centuries. Whether you’re preparing a simple curry or a festive feast, our spices ensure your recipes taste authentic and rich. They also aid in digestion, immunity, and overall wellness. Cook like your grandmother did – with spices that are pure, strong, and full of life. Our homemade spices are a must-have for every health-conscious kitchen.','2025-08-26 06:40:03','2025-08-26 06:40:03'),(7,'Dry Fruits','Packed with energy, nutrition, and taste, our dry fruits are carefully sourced and hygienically packed for your daily needs. From almonds, cashews, walnuts, and raisins to traditional favorites like dates, figs, and apricots, we bring you nature’s best superfoods. Rich in protein, fiber, vitamins, and healthy fats, these dry fruits are perfect for snacking, cooking, or gifting. Unlike processed ones coated with artificial sugar or preservatives, ours are 100% natural and unadulterated. Whether soaked in milk, blended in smoothies, or added to sweets and biryanis, dry fruits enhance every recipe with taste and nutrition. They are also known for boosting memory, improving skin glow, strengthening bones, and keeping energy levels high throughout the day. Perfect for kids, elders, and fitness lovers, our dry fruits are the healthiest way to stay active and refreshed. Enjoy natural crunch and sweetness, straight from nature’s treasure chest.','2025-08-26 06:40:18','2025-08-26 06:40:18'),(8,'Sweets','Indulge in traditional homemade sweets prepared with authentic recipes passed down through generations. Our sweets are crafted using pure ghee, jaggery, and natural ingredients without artificial colors or preservatives. From laddus, mysore pak, and burfis to regional specialties like adhirasam, halwa, and palkova, every bite takes you back to the flavors of festivals and family celebrations. Unlike mass-produced sweets, ours are freshly made in small batches to maintain authenticity, taste, and quality. Each sweet is prepared with care, ensuring perfect balance of taste and nutrition. Our jaggery-based sweets are healthier alternatives to sugar-loaded desserts, making them safe for all age groups. Whether you’re celebrating a festival, gifting loved ones, or simply satisfying your sweet tooth, our sweets bring joy and nostalgia with every bite. Relish the goodness of homemade love, wrapped in tradition and purity, in every sweet you taste.','2025-08-26 06:40:32','2025-08-26 06:40:32'),(9,'Pantry Essentials','Stock your kitchen with our range of homemade pantry essentials – from rice, lentils, pulses, and flours to masalas, pickles, and herbal powders. We believe in providing everyday staples that are pure, natural, and chemical-free. Our rice is hand-pounded, our flours are stone-ground, and our pulses are organically grown without synthetic fertilizers. Every item is packed with care to preserve freshness, flavor, and nutrition. Unlike polished store-bought products, ours retain natural fiber, minerals, and vitamins. These pantry essentials not only make cooking easier but also ensure healthier meals for your family. We also provide traditional kitchen must-haves like rock salt, palm jaggery, and millet-based flours to revive native food habits. With our pantry collection, you no longer have to worry about adulteration or compromise on quality. Make your daily cooking simple, tasty, and wholesome with our thoughtfully curated pantry range.','2025-08-26 06:40:52','2025-08-26 06:40:52'),(10,'Pickles','Our homemade pickles are prepared using traditional recipes that have been loved for generations. Made with fresh vegetables, handpicked spices, and cold-pressed oils, our pickles are free from synthetic preservatives and artificial colors. From tangy mango pickle and spicy lemon pickle to garlic, gooseberry, and mixed vegetable pickles, every jar is filled with authentic flavors that enhance any meal. Unlike mass-produced pickles that rely on vinegar and chemicals, ours are naturally fermented, making them rich in probiotics that support digestion and gut health. Each bite offers the perfect blend of spice, tang, and aroma, reminding you of grandma’s kitchen. Whether paired with hot rice, rotis, or dosas, our pickles add a burst of flavor and make everyday meals extra special. Packed hygienically in small batches, our pickles retain freshness and authenticity. Experience the taste of tradition in every spoonful, crafted with love and care.','2025-08-26 06:42:22','2025-08-26 06:42:22'),(11,'Herbal Powders','We bring you a wide range of herbal powders made from naturally dried and finely ground leaves, roots, and seeds. From moringa leaf powder, amla powder, and neem powder to shikakai, hibiscus, and multani mitti, our collection covers both health and beauty needs. Each powder is prepared using sun-drying and stone-grinding methods to preserve nutrients and medicinal properties. These herbal powders are packed with vitamins, minerals, and antioxidants, making them an excellent addition to your daily wellness routine. They can be consumed internally to improve immunity, digestion, and energy levels, or applied externally for skincare and hair care. Unlike commercial powders mixed with chemicals, ours are 100% pure and natural, sourced directly from trusted farmers and processed in hygienic conditions. Whether you are looking for natural remedies, ayurvedic supplements, or beauty care products, our herbal powders offer a safe and effective solution.','2025-08-26 06:42:41','2025-08-26 06:42:41'),(12,'Health Mix Powders','Our health mix powders are the perfect blend of traditional grains, pulses, nuts, and herbs, crafted to provide complete nutrition for all age groups. We offer varieties like multi-millet mix, sathu maavu, sprouted grain mix, and baby food mixes – all made without preservatives or artificial flavors. Prepared using stone-grinding and roasting techniques, these powders retain natural aroma, taste, and nutrition. Just mix with hot milk or water, and you have a wholesome meal in minutes. Rich in protein, calcium, fiber, and essential minerals, health mix powders boost energy, improve digestion, and strengthen immunity. They are especially beneficial for growing children, working professionals, and elders who need quick and healthy meals. Unlike store-bought supplements filled with sugar and chemicals, ours are pure, homemade, and safe for daily consumption. Bring back the traditional way of healthy eating with our naturally nourishing health mix powders.','2025-08-26 06:42:54','2025-08-26 06:42:54'),(13,'Jaggery & Natural Sweeteners','Say goodbye to refined sugar and switch to natural alternatives like jaggery, palm jaggery, and country sugar. Our jaggery is sourced from farmers who prepare it using traditional methods without chemical bleaching or additives. Rich in iron, calcium, and essential minerals, jaggery not only sweetens your food but also purifies blood, boosts energy, and improves digestion. Palm jaggery is especially beneficial for cooling the body and strengthening immunity. We also provide raw cane sugar and honey as healthier natural sweeteners. Unlike processed sugar that causes health issues, our natural sweeteners are safe for all age groups and add authentic taste to sweets, beverages, and desserts. Whether you’re preparing traditional sweets or daily tea and coffee, switching to our natural sweeteners ensures both taste and health. Every pack is hygienically processed and delivered fresh, keeping your family away from harmful refined sugar.','2025-08-26 06:43:09','2025-08-26 06:43:09'),(14,'Millets','Rediscover the lost superfoods with our wide range of millets like foxtail millet, pearl millet, finger millet (ragi), barnyard millet, and little millet. These ancient grains are rich in fiber, protein, and essential minerals, making them the perfect alternative to rice and wheat. Millets are gluten-free, easy to digest, and excellent for managing diabetes, weight, and heart health. Our millets are naturally grown without chemical fertilizers and polished using traditional methods to retain nutrients. You can prepare a variety of dishes like millet dosa, idli, pongal, pulao, or even desserts. Unlike refined cereals, millets keep you full for longer, regulate blood sugar, and boost energy levels. We also provide ready-to-cook millet-based mixes for convenience. Packed with goodness and versatility, millets are the future of healthy eating. Bring back traditional food habits with our carefully sourced and hygienically packed millet range.','2025-08-26 06:43:24','2025-08-26 06:43:24'),(15,'Homemade Snacks','Enjoy guilt-free munching with our collection of homemade snacks prepared with pure ingredients and traditional recipes. From crispy murukku, thattai, and mixture to roasted nuts, seed mixes, and baked goodies, our snacks are both delicious and healthy. We avoid refined flour, artificial colors, and preservatives – instead using wholesome flours, cold-pressed oils, and natural spices. Each batch is freshly made to order, ensuring freshness and authentic taste. These snacks are perfect for tea-time, kids’ tiffin boxes, or simply when hunger strikes. Unlike packaged junk food filled with MSG and chemicals, our snacks are light on the stomach yet packed with nutrition. We also offer jaggery-based sweets, energy laddus, and millet snacks for health-conscious customers. Whether you crave spicy, crunchy, or sweet treats, our snack collection satisfies your taste buds while keeping health in check. Snack smart with homemade goodness!','2025-08-26 06:43:41','2025-08-26 06:43:41'),(16,'Beverages & Syrups','Our beverages and syrups are made from natural ingredients like herbs, fruits, and jaggery, offering refreshing and healthy alternatives to aerated drinks. From nannari sherbet, hibiscus syrup, and ginger juice to traditional buttermilk spice mixes and herbal teas, every sip is packed with natural flavor and nutrition. Unlike artificial soft drinks loaded with sugar and chemicals, our beverages are free from synthetic preservatives and colors. They not only quench thirst but also offer health benefits like improved digestion, cooling the body, and boosting immunity. Our syrups are concentrated extracts made from fresh herbs and fruits, which can be mixed with water or milk for instant drinks. Perfect for kids and adults alike, these beverages bring back the traditional taste of homemade coolers. Enjoy refreshing drinks that are healthy, natural, and nostalgic.','2025-08-26 06:43:58','2025-08-26 06:43:58'),(17,'Flours','Our flours are stone-ground and freshly packed, retaining the natural fiber, aroma, and nutrition of the grains. We offer a wide range including rice flour, wheat flour, ragi flour, multigrain flour, and special millet-based flours. Unlike factory-made refined flours, ours are unpolished and chemical-free, making them healthier for everyday cooking. Stone-grinding keeps the flour cool during processing, ensuring vitamins and minerals are not lost. Perfect for chapatis, dosas, idlis, and baked goods, our flours make cooking wholesome meals easy and tasty. We also prepare custom mixes like idiyappam flour, puttu flour, and instant dosa mixes for convenience. Rich in fiber and protein, our flours aid digestion, control blood sugar, and support weight management. With our flours, you can enjoy the real taste of traditional food while taking care of your health.','2025-08-26 06:44:19','2025-08-26 06:44:19'),(18,'Rice & Grains','Bring home naturally grown, unpolished rice and grains that preserve nutrients and authentic taste. From hand-pounded red rice, black rice, and seeraga samba to barnyard millet rice and bamboo rice, we provide varieties that go beyond regular polished rice. Our rice is grown using organic farming practices and processed traditionally to retain its natural goodness. Rich in fiber, protein, and essential minerals, these grains improve digestion, immunity, and energy levels. Perfect for making everyday meals, biryanis, pongal, or payasam, our rice varieties give you both taste and nutrition. Unlike highly polished white rice, our natural grains keep you full for longer and support a healthy lifestyle. Each pack is cleaned, packed, and delivered with care to bring the richness of traditional farming to your kitchen.','2025-08-26 06:45:13','2025-08-26 06:45:13'),(19,'Honey','Our honey is raw, unfiltered, and collected directly from trusted local beekeepers. Unlike commercial honey that is often processed and diluted with sugar syrups, our honey is pure and packed with natural enzymes, vitamins, and minerals. It retains its original aroma and thick texture, ensuring you get all the natural benefits. Honey is known for boosting immunity, soothing sore throats, aiding digestion, and promoting healthy skin. It is also a healthier alternative to sugar, perfect for adding sweetness to tea, desserts, or health drinks. We also provide unique varieties like wild forest honey and multi-floral honey, each with its own flavor and medicinal value. Every jar of our honey is hygienically packed, ensuring freshness and purity. Add our natural honey to your daily routine for a boost of health and energy straight from nature.','2025-08-26 06:45:26','2025-08-26 06:45:26'),(20,'Homemade Sauces & Pastes','Our sauces and pastes are crafted with fresh ingredients, natural spices, and traditional recipes. From tomato and chili sauces to ginger-garlic paste, curry pastes, and chutneys, our collection makes cooking easier and tastier. Unlike packaged sauces filled with preservatives, our products are freshly prepared in small batches and free from artificial additives. They bring authentic flavors to your everyday dishes, whether Indian curries, continental recipes, or snacks. Our ginger-garlic paste saves cooking time while retaining natural aroma, and our tomato chutneys add a tangy twist to meals. These homemade condiments are hygienically packed and convenient for quick cooking without compromising on health or taste. Bring back the comfort of homemade cooking with our ready-to-use sauces and pastes.','2025-08-26 06:45:45','2025-08-26 06:45:45'),(21,'Seeds & Superfoods','Our seeds and superfoods are packed with natural nutrients and health benefits. From chia seeds, flax seeds, and sunflower seeds to native treasures like black sesame, pumpkin seeds, and moringa seeds, we bring you a wide selection of powerful foods. These seeds are rich in protein, fiber, omega-3 fatty acids, and antioxidants, making them essential for a balanced diet. Perfect for sprinkling on salads, smoothies, or baked goods, they enhance both taste and nutrition. Our seeds are naturally sourced, cleaned, and hygienically packed without any artificial polish or preservatives. Regular consumption improves digestion, heart health, and overall energy levels. For health-conscious individuals and fitness lovers, our seeds and superfoods are the perfect daily companions. Enjoy pure, natural, and nutrient-rich foods that keep you strong and active.','2025-08-26 06:45:59','2025-08-26 06:45:59'),(22,'Traditional Herbal Drinks','We revive age-old recipes with our collection of traditional herbal drinks like sukku coffee (dry ginger coffee), kashayam powders, turmeric latte mixes, and jeera water mixes. These drinks are made with carefully chosen herbs and spices, sun-dried and ground to preserve their medicinal properties. Known for boosting immunity, relieving cold and cough, improving digestion, and detoxifying the body, these herbal drinks are safe and effective for all age groups. Unlike caffeinated or carbonated beverages, our herbal drinks are natural, caffeine-free, and full of health benefits. They can be prepared easily at home and enjoyed either hot or cold. Every sip connects you to traditional Indian wisdom that has kept families healthy for centuries. Bring wellness and taste together with our range of herbal drinks, crafted to support modern lifestyles with the power of nature.','2025-08-26 06:46:15','2025-08-26 06:51:08');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price_at_purchase` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status`
--

DROP TABLE IF EXISTS `order_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status`
--

LOCK TABLES `order_status` WRITE;
/*!40000 ALTER TABLE `order_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `address_id` int NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `order_status_id` int NOT NULL DEFAULT '1',
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method_id` int NOT NULL,
  `tracking_number` varchar(100) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `address_id` (`address_id`),
  KEY `order_status_id` (`order_status_id`),
  KEY `payment_method_id` (`payment_method_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`order_status_id`) REFERENCES `order_status` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `method` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `method` (`method`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_status`
--

DROP TABLE IF EXISTS `payment_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_status`
--

LOCK TABLES `payment_status` WRITE;
/*!40000 ALTER TABLE `payment_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_status_id` int NOT NULL DEFAULT '1',
  `transaction_id` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `payment_status_id` (`payment_status_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`payment_status_id`) REFERENCES `payment_status` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int NOT NULL DEFAULT '0',
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `additional_images` json DEFAULT NULL,
  `category_id` int NOT NULL,
  `admin_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'thinai laddu','home made thinai laddu',240.00,15,'/productImages/1756192566056-Screenshot-2025-08-26-124437.png','[]',8,1,'2025-08-26 07:16:06','2025-08-26 09:56:22'),(2,'laddu','laddu',200.00,2,'/productImages/1756202704577-Screenshot-2025-08-26-124456.png','[]',8,1,'2025-08-26 10:05:04','2025-08-26 10:11:48');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `product_id` int NOT NULL,
  `is_liked` tinyint NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_wish` (`customer_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-26 15:51:16
