const express = require('express')
const router = express.Router()

const verifyToken = require('../middlewares/auth.middleware')
const isAdmin = require('../middlewares/isAdmin.middleware')

router.get('/panel', verifyToken, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Panel administrador',
    user: req.user
  })
})

module.exports = router
