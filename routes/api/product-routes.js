const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


router.get('/', async (req, res) => {
  try {
    const product = await Product.findAll({
      include: [
      {
        model: Category,
        attributes: ['category_name'],
      },
      {
        model: Tag,
        attributes: ['tag_name'],
      }]
    });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});


router.get('/:id',async (req, res) => {

  const productId = req.params.id;

  try {
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Category,
          attributes: ['category_name'],
        },
        {
          model: Tag,
          attributes: ['tag_name'],
        }]
      });
    
    if (!product) {
      return res.status(404).json({ error: 'product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

router.post('/', async (req, res) => {
  try {
    const createdProduct = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: createdProduct.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }
    
    res.status(200).json(createdProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'Failed to create product' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.update(
      {
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    const productTags = await ProductTag.findAll({
      where: {
        product_id: req.params.id,
      },
    });

    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });

    const productTagResults = await Promise.all([
      ProductTag.destroy({ where: { product_id: req.params.id } }),
      ProductTag.bulkCreate(newProductTags),
    ]);

    res.json(updatedProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});




router.delete('/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const numRowsDeleted = await Product.destroy({
      where: { id: productId }
    });
    if (numRowsDeleted === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;