const express=require( 'express' );
const mongoose=require( 'mongoose' );
const bcrypt=require( 'bcrypt' );
const router=express.Router();
const { check, validationResult }=require( 'express-validator' );
const userSchema=new mongoose.Schema( {
    name: String,
    email: String,
    password: String
} );

const User=mongoose.model( 'User', userSchema );

router.get( '/', async ( req, res ) => {
    const users=await User.find();
    res.render( 'index', { users } );
} );

router.post( '/', [
    check( 'name' ).notEmpty().withMessage( 'El nombre es obligatorio' ),
    check( 'email' ).isEmail().withMessage( 'El correo electrónico no es válido' ),
    check( 'password' ).isLength( { min: 6 } ).withMessage( 'La contraseña debe tener al menos 6 caracteres' ),
], async ( req, res ) => {
const errors=validationResult( req );
    if ( !errors.isEmpty() ) {
        return res.status( 400 ).json( { errors: errors.array() } );
    }
    const { name, email, password }=req.body
    const hashPassord=await bcrypt.hash( password, 10 )
    const newUser=new User( { name, email, password: hashPassord } );
    await newUser.save();
    res.redirect( '/users' );
} );

router.get( '/edit/:id', async ( req, res ) => {

    const user=await User.findById( req.params.id );
    res.render( 'partials/edit', { user } );
} );
router.post( '/update/:id',  [
    check( 'name' ).notEmpty().withMessage( 'El nombre es obligatorio' ),
    check( 'email' ).isEmail().withMessage( 'El correo electrónico no es válido' ),
    check( 'password' ).isLength( { min: 6 } ).withMessage( 'La contraseña debe tener al menos 6 caracteres' ),
], async ( req, res ) => {
    const errors=validationResult( req );
    if ( !errors.isEmpty() ) {
        return res.status( 400 ).json( { errors: errors.array() } );
    }
    const { name, email, password }=req.body
    const hashPassord=await bcrypt.hash( password, 10 )
    await User.findByIdAndUpdate( req.params.id, { name, email, password: hashPassord } );
    res.redirect( '/users' );
} );

router.get( '/delete/:id', async ( req, res ) => {
    await User.findByIdAndDelete( req.params.id );
    res.redirect( '/users' );
} );

module.exports=router;
