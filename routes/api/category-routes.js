const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({ include: [{model: Product}] });
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({ message: "Request unable to be fulfilled, not found!"})
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, { include: [{ model: Product}] });
     if (!category) {
      return res.status(404).json({ message: "Request unable to be fulfilled, id not found!"})
     }
     return res.status(200).json(category);
  } catch (err) {
    return res.status(500).json({ message: "Request unable to be fulfilled, not found!"})
  }
});

router.post('/', async (req, res) => {
  try {
    const createdCategory = await Category.create(req.body);
    return res.status(200).json(createdCategory);
  } catch (err) {
    return res.status(400).json({ message: "Request unable to be fulfilled, Category creation failed!"});
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Category.update(req.body, { where: { id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ message: "Request unable to be fulfilled, id not found!" })
     }
      return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Request unable to be fulfilled, Category update failed!" });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [deleted] = await Category.destroy({ where: { id: req.params.id} });
    if (!deleted) {
      return res.status(404).json({ message: "Request unable to be fulfilled, id not found!" }) 
    }
      return res.status(200).json(deleted);
  } catch (err) {
    return res.status(500).json({ message: "Request unable to be fulfilled, Category deletion failed!" });
  }
});


module.exports = router;
