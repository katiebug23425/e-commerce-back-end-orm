const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    // Fetch all tags and include associated products
    const allTags = await Tag.findAll({
      include: [{ model: Product }],
    });

    // Respond with the fetched tags and associated products
    return res.status(200).json(allTags);
  } catch (err) {
    // Handle any errors that occur during the fetching process
    return res.status(500).json({ message: "Request unable to be fulfilled, tags not found!" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Find a tag by its primary key and include associated products
    const tagInfo = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    // Check if the tagInfo is null (tag not found)
    if (!tagInfo) {
      return res.status(404).json({ message: "Request unable to be fulfilled, no tags with this id found!" });
    }

    // Respond with the fetched tag information
    return res.status(200).json(tagInfo);
  } catch (err) {
    // Handle any errors that occur during the fetching process
    return res.status(500).json({ message: "Request unable to be fulfilled, tag not found!" });
  }
});

router.post('/', async (req, res) => {
  try {
    // Create a new tag using the data from req.body
    const tagInfo = await Tag.create(req.body);

    // Respond with the created tag information
    return res.status(200).json(tagInfo);
  } catch (err) {
    // Handle any errors that occur during the creation process
    return res.status(400).json({ message: "Request unable to be fulfilled, tag creation failed!" });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedTag = await Tag.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updatedTag[0]) {
      return res.status(400).json({ message: "Request unable to be fulfilled, no tag with this id found!" })
    }
      return res.status(200).json(updatedTag);
  } catch (err) {
    return res.status(500).json({ message: "Request unable to be fulfilled, tag update failed!" });
  }
});

router.delete('/:id', async (req, res) => {
  try {
     // Attempt to delete the tag with the specified ID
    const deleted = await Tag.destroy({ where: { id: req.params.id} });

    // Check if the tag was deleted successfully
    if (!deleted) {
    return res.status(400).json({ message: "Request unable to be fulfilled, no tag with this id found!"})
    }

    // Return a success message along with the deleted product
    res.status(200).json(deleted);
  } catch (err) {
     // Handle any errors that occur during the deletion process
    return res.status(500).json({ message: "Request unable to be fulfilled, tag deletion failed!"});
  }
});

module.exports = router;
