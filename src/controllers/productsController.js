const db = require ("../../database/models/");
const Op = db.Sequelize.Op;
const path = require ('path');
const { validationResult } = require('express-validator');
const destinationFolder = '/img/productos_pcArmadas/';
const destinationFolderMarca = '/img/'

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const productController = {

    ////////////////// SECCION COMPUTADORAS ARMADAS
    product: async function(req, res) {
        try {
            let productos = await db.Producto.findAll ({ include: [{association:"categorias"}] });
            res.render("products/products", {productos, destinationFolder, destinationFolderMarca,toThousand})
        } catch (error) {
            console.log(error);
        }
        
        // db.Producto.findAll({ include: [{association:"categorias"}] })
        // .then (function(productos){
        // res.render("products/products", {productos, destinationFolder, destinationFolderMarca})
        // })
    },
    ////////////////// DETALLE DE PC SELECCIONADA
    productDetail:function (req,res) {
        db.Producto.findByPk( req.params.id, { include: [{association:"categorias"}] })
        .then (function(productos){
        res.render("products/productDetail", {productos, destinationFolder, destinationFolderMarca,toThousand})
        })
    },

    ////////////////// SECCION CARRITO
    productCart:function (req,res) {
        res.render("products/productCart");
    },

    ////////////////// CREAR NUEVO PRODUCTO PC ARMADA
    newProduct:function (req,res) {
        res.render("products/newProduct");
    },

    createNewProduct: function(req, res) {
        db.Producto.create({
            titulo: req.body.nombre,
            imagen: (req.file ? req.file.filename : 'defoulImage.jpg'),
            categoria_id: (req.body.categoria == 'Amd' ? 2 : 1),
            procesador: req.body.procesador,
            mother: req.body.mother,
            video: req.body.video,
            ram: req.body.ram,
            disco: req.body.disco,
            gabinete: req.body.gabinete,
            fuente: req.body.fuente,
            precio: req.body.precio,
        })
        res.redirect ('/products/products');
    },

    ////////////////// FIN DE PRODUCTOS NUEVOS

    ////////////////// EDITAR PC ARMADA
    editProduct:function (req,res) {
        db.Producto.findByPk( req.params.id, { include: [{association:"categorias"}] })
        .then (function(productos){
        res.render("products/editProduct", {productos, destinationFolder, destinationFolderMarca})
        })
    },

    processEditProduct: function (req, res) {
        let resultValidation = validationResult (req);
            if (resultValidation.errors.length <= 0){
                db.Producto.findByPk( req.params.id, { include: [{association:"categorias"}] })
                .then (function(productos){
                    let imagen = productos.imagen;
                    db.Producto.update ({
                        titulo: req.body.nombre,
                        imagen: (req.file ? req.file.filename : imagen),
                        categoria_id: (req.body.categoria == 'Amd' ? 2 : 1),
                        procesador: req.body.procesador,
                        mother: req.body.mother,
                        video: req.body.video,
                        ram: req.body.ram,
                        disco: req.body.disco,
                        gabinete: req.body.gabinete,
                        fuente: req.body.fuente,
                        precio: req.body.precio,
                    },
                    {
                        where: {id: req.params.id}
                    });
                    /// REDIRECCIONAMOS VIS
                    res.redirect ('/products/products')
                });
            }else{
                db.Producto.findByPk( req.params.id, { include: [{association:"categorias"}] })
                .then (function(productos){
                res.render("products/editProduct", {errors: resultValidation.mapped(), oldData: req.body,productos, destinationFolder, destinationFolderMarca})
                })
            }
    },

    ///////////////// FIN DE EDITAR PRODUCTOS

    ///////////////// ELIMINAR PRODUCTOS

    deleteProduct: function (req,res) {
        db.Producto.destroy ({ where: {id: req.params.id} });
        /// REDIRECCIONAMOS VISTA
        res.redirect ('/products/products')
    },
    
    ////////////////// CONFIRMACION ELIMINAR PRODUCTO
    confirmDelete:function (req,res) {
        db.Producto.findByPk( req.params.id, { include: [{association:"categorias"}] })
        .then (function(productos){
        res.render("products/confirmDelete", {productos, destinationFolder, destinationFolderMarca})
        })
    }
    
}
module.exports = productController;