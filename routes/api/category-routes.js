const router = require('express').Router();
const { Category, Product } = require('../../models');


router.get('/', async (req, res) => {
    try {
      const categories = await Category.findAll({
        include: {
          model: Product
        }
      });
      res.json(categories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve categories' });
    }
  });


  router.get('/:id', async (req, res) => {
    const categoryId = req.params.id;
  
    try {
      const category = await Category.findByPk(categoryId, {
        include: {
          model: Product
        }
      });
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve category' });
    }
  });

  router.post('/', async (req, res) => {
    const { categoryName } = req.body;
  
    try {
      const newCategory = await Category.create({ categoryName });
      res.status(201).json(newCategory);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create category' });
    }
  });
  

  router.put('/:id', async (req, res) => {
    const categoryId = req.params.id;
    const { categoryName } = req.body;
  
    try {
      const [numRowsUpdated, [updatedCategory]] = await Category.update(
        { categoryName },
        {
          where: { id: categoryId },
          returning: true
        }
      );
      if (numRowsUpdated === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(updatedCategory);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update category' });
    }
  });
  
  router.delete('/:id', async (req, res) => {
    const categoryId = req.params.id;
  
    try {
      const numRowsDeleted = await Category.destroy({
        where: { id: categoryId }
      });
      if (numRowsDeleted === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  });
  

module.exports = router;
