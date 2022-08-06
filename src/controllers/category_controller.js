// * Importación de las dependencias
const { request, response } = require('express');

// * Importación de los modelos
const Category = require('../models/category_model');

// * Controlador para mostrar todas las categorias
const getCategories = async ( req = request, res = response ) => {
    try {
        const categories = await Category.find();
        if ( !categories ) {
            return res.status(400).json({ msg : 'No se encontraron las categorias' });
        }
        res.status(200).json({
            categories
        })
    } catch (error) {
        return res.status(400).json({ msg : 'No se encontraron las categorias' });
    }
}

const getCategoryById = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const category = await Category.findById( id );
        if ( !category ) {
            return res.status(400).json({ msg : 'No se encontraron las categorias' });
        }
        res.status(200).json({
            category
        })
    } catch (error) {
        return res.status(400).json({ msg : 'No se encontraron las categorias' });
    }

}

// * Controlador para crear categorias
const createCategory = async ( req = request, res = response ) => {
    try {
        const { name } = req.body;
        const key = name.toLowerCase().split(' ').join('_');
        const category = await Category.findOne({
            key
        });
        if ( category ){
            return res.status(400).json({ msg :'La categoria ya existe' });
        }
        const newCategory = new Category({
            name,
            key
        });
        const createdCategory = await newCategory.save();
        if ( !createdCategory ) {
            return res.status(400).json({ msg: 'No se pudo crear la categoria' });
        }
        res.status(200).json({ msg: 'Categoria creada con exito' });
    } catch (error) {
        return res.status(500).json({ msg: 'No se pueden cargar las categorias' });
    }
}

module.exports = {
    createCategory,
    getCategories,
    getCategoryById
}