const Cart = require('../models/addtocartmodel')
const User = require('../models/user');


const blogpage = async(req,res)=>{
    const userId = req.session.iduser;
        const users = await Cart.findOne({ user: userId }).populate('products.product');

    res.render('staticpages/blog',{ users: users });
}
const blogpage2 = async(req,res)=>{
    const userId = req.session.iduser;
        const users = await Cart.findOne({ user: userId }).populate('products.product');

    res.render('staticpages/blog2',{ users: users });
}

const aboutuspage = async(req,res)=>{
    const userId = req.session.iduser;
        const users = await Cart.findOne({ user: userId }).populate('products.product');

    res.render('staticpages/aboutus',{ users: users });
}
const aboutmepage = async (req, res) => {
    try {
        const userId = req.session.iduser;
        const users = await Cart.findOne({ user: userId }).populate('products.product');

        // Check if users is defined before rendering the view
        if (users) {
            return res.render('staticpages/aboutme', { users: users });
        }

        // If users is not defined, render the view without passing users
        res.render('staticpages/aboutme');
    } catch (error) {
        console.error(error);
        // Handle the error appropriately, e.g., send an error response or render an error page.
        res.status(500).send('Internal Server Error');
    }
};

const pricingpage = async (req,res)=>{
    const userId = req.session.iduser;
        const users = await Cart.findOne({ user: userId }).populate('products.product');

    res.render('staticpages/pricetable',{ users: users });
}

const whatwedopage = async(req,res)=>{
    const userId = req.session.iduser;
        const users = await Cart.findOne({ user: userId }).populate('products.product');

    res.render('staticpages/whatwedo',{ users: users });
}

const faqspage = async(req,res)=>{
    const userId = req.session.iduser;
        const users = await Cart.findOne({ user: userId }).populate('products.product');

    res.render('staticpages/faqs',{ users: users });
}

const ourteampage = async(req,res)=>{
    const userId = req.session.iduser;
        const users = await Cart.findOne({ user: userId }).populate('products.product');

    res.render('staticpages/ourteam',{ users: users });
}

const contactuspage = async(req,res)=>{
    const userId = req.session.iduser;
        const users = await Cart.findOne({ user: userId }).populate('products.product');

    res.render('staticpages/contactus',{ users: users });
}

module.exports = {
    blogpage,
    aboutuspage,
    aboutmepage,
    pricingpage,
    whatwedopage,
    faqspage,
    ourteampage,
    contactuspage,
    blogpage2

}