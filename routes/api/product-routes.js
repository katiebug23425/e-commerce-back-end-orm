const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: "Request unable to be fulfilled, Products not found!" });
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    // Find a product by its primary key and include associated products
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });

    // Check if the prduct is null (product not found)
   if  (!product) {
     return res.status(404).json({ message: "Request unable to be fulfilled, Product not found!" })
   }

    // Respond with the fetched product information
    return res.status(200).json(product);
  } catch (err) {
    // Handle any errors that occur during the fetching process
    return res.status(500).json({ message: "Request unable to be fulfilled, Product retrieval failed!" });
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    // Create a new product using the data from req.body
    const product = await Product.create(req.body);

    // Check if there are any tagIds in the request body
    if (req.body.tagIds.length) {
      // Create an array of objects for bulk creation in the ProductTag model
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });

      // Bulk create the productTagIdArr in the ProductTag model
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);

      // Respond with the productTagIds if successful
      res.status(200).json(productTagIds);
    } else {
      // If no product tags, respond with the created product
      res.status(200).json(product);
    }
  } catch (err) {
    // Handle any errors that occur during the creation process
    console.log(err);
    res.status(400).json({ message: "Request unable to be fulfilled, Product creation failed!" });
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    // Update product data
    const updatedProduct = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });

      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // Run both actions
      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }

    // Respond with the updated product
    res.json(updatedProduct);
  } catch (err) {
    // Handle any errors that occur during the update process
    console.log(err);
    res.status(400).json({ message: "Request unable to be fulfilled, Product update failed!" });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Attempt to delete the product with the specified ID
    const deletedProduct = await Product.destroy({ where: { id: req.params.id } });

    // Check if the product was deleted successfully
    if (!deletedProduct) {
      return res.status(404).json({ message: "Request unable to be fulfilled, id not found!" });
    }

    // Return a success message along with the deleted product
    res.status(200).json(deletedProduct);
  } catch (err) {
    // Handle any errors that occur during the deletion process
    return res.status(500).json({ message: "Request unable to be fulfilled, Product deletion failed!" });
  }
});

module.exports = router;
