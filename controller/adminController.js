const User = require("../model/userschema");
const Product = require("../model/productschema");
const Category = require("../model/categoryschema");
const Coupon = require("../model/couponschema");
const Order = require("../model/orderschema");
const Banner = require("../model/bannerschema");
const Admin = require("../model/adminschema");

const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const moment = require('moment')
const sharp = require("sharp");
const dotenv = require("dotenv");
dotenv.config();

function adminLogin(req, res) {
  try {
    res.render("admin/login");
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

async function postAdminLogin(req, res) {
  try {
    
    let admin = await Admin.findOne();
    
    let pswd = await bcryptjs.compare(req.body.password,admin.password)
    if (req.body.email === admin.email && pswd===true ) { 
      req.session.adminsession = admin.email;
      return res.redirect("admin/dashboard");
    } else {
      return res.render("admin/login", { errorr: "Invalid Login Details" });
    }
  } catch (error) {
    console.log(error)
    return res.redirect("/admin/errorPage");
  }
}

async function dashboard(req, res) {
  try {
    let customers = await User.find().countDocuments();
    let products = await Product.find({isDeleted:false}).countDocuments();
    let orders = await Order.find().countDocuments();
    let orderSum = await Order.aggregate([{$group: {_id:null, sum:{$sum:"$paidAmount"}}}]);

    let data={
      customers:customers,
      products:products,
      orders:orders,
      orderSum: orderSum[0].sum
    }
    return res.render("admin/dashboard",{data});
  } catch (error) {
    console.log(error);
    return res.redirect("/admin/errorPage");
  }
}

async function graph(req,res){
  try{
    let currentYear = new Date();
    currentYear = currentYear.getFullYear();
    const orderData = await Order.aggregate([  
      {
        $project: {
          _id: 0,
          billAmount: "$paidAmount",
          month: {
            $month: "$orderDate",
          },
          year: {
            $year: "$orderDate",
          },
        },
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          totalOrders: { $sum: 1 },
          revenue: {
            $sum: "$billAmount",
          },
          avgBillPerOrder: {
            $avg: "$billAmount",
          },
        },
      },
      {
        $match: {
          "_id.year": currentYear,
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
    ])
    const orders = await Order.find().populate("orderedItems.productid")

console.log(orderData);

res.json({orderData,orders})

  }catch(error){
    console.log(error)
    return res.redirect("/admin/errorPage");

  }
}
 
async function products(req, res) {
  try {
    const products = await Product.find({isDeleted:false}).populate("product_category"); 
    return res.render("admin/products", { products }); 
  } catch (error) {
    console.log(error);
    return res.redirect("/admin/errorPage");
  }
}

async function add_products(req, res) {
  try {
    const cat = await Category.find();
    return res.render("admin/add-products", { cat: cat, message: null });
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}
async function postadd_products(req, res) {
  try {
    const cat = await Category.find();
    let check = await Product.findOne({
      product_title: { $regex: req.body.product_title, $options: "i" },
    });
    if (check) {
      return res.render("admin/add-products", {
        cat: cat,
        message: "Product Already Exists",
      });
    } else {
      if (isNaN(req.body.price)) {
        return res.render("admin/add-products", {
          cat: cat,
          message: "Price should be a number",
        });
      } else {
        if (isNaN(req.body.stock)) {
          return res.render("admin/add-products", {
            cat: cat,
            message: "Price should be a number",
          });
        } else {
          console.log(req.files.image1[0].mimetype);
            if (
              req.files.image1[0].mimetype === "image/jpeg" ||
              req.files.image1[0].mimetype === "image/JPEG" ||
              req.files.image1[0].mimetype === "image/jpg" ||
              req.files.image1[0].mimetype === "image/JPG"
            ) {
              const imagesarray = [
                req.files.image1[0].filename,
                req.files.image2[0].filename,
                req.files.image3[0].filename,
                req.files.image4[0].filename,
              ];
              const resizedImage = [];

              for (i = 0; i < 4; i++) {
                const ImageName =
                  req.body.product_title + [i] + "-" + Date.now() + ".jpg";
                resizedImage.push(ImageName);
                sharp(`./public/images/product_images/${imagesarray[i]}`)
                  .resize(300, 300)
                  .jpeg({ quality: 50 })
                  .toFile(
                    `./public/images/processed_images/${ImageName}`,
                    (err, info) => {
                      console.log("err" + err);
                      console.log("info" + info);
                    }
                  );
              }
              const products = new Product({
                product_title: req.body.product_title,
                product_description: req.body.product_description,
                product_category: mongoose.Types.ObjectId(
                  req.body.product_category
                ),
                price: req.body.price,
                size: req.body.size,
                stock: req.body.stock,
                images: resizedImage,
                isDeleted: false,
              });
              await products.save();
              return res.redirect("/admin/products");
            } else {
              return res.render("admin/add-products", {
                cat: cat,
                message: "image should be .jpg or .jpeg format",
              });
            }
          
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/admin/errorPage");
  }
}

async function editProduct(req, res) {
  try {
    let prod = await Product.findById({ _id: req.params._id }).populate(
      "product_category"
    );
    let cat = await Category.find();
    return res.render("admin/edit-products", { prod, cat });
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

async function posteditProduct(req, res) {
  try {
    await Product.updateOne(
      { _id: req.params._id },
      {
        $set: {
          product_title: req.body.product_title,
          product_description: req.body.product_description,
          product_category: mongoose.Types.ObjectId(req.body.product_category),
          price: req.body.price,
          size: req.body.size,
          stock: req.body.stock,
        },
      }
    );
    if (req.files.image1) {
      const ImageName = req.body.product_title + "1-" + Date.now() + ".jpg";
      sharp(`./public/images/product_images/${req.files.image1[0].filename}`)
        .resize(300, 300)
        .jpeg({ quality: 50 })
        .toFile(`./public/images/processed_images/${ImageName}`);
      await Product.updateOne(
        { _id: req.params._id },
        {
          $set: {
            "images.0": ImageName,
          },
        }
      );
    }
    if (req.files.image2) {
      const ImageName = req.body.product_title + "2-" + Date.now() + ".jpg";
      sharp(`./public/images/product_images/${req.files.image2[0].filename}`)
        .resize(300, 300)
        .jpeg({ quality: 50 })
        .toFile(`./public/images/processed_images/${ImageName}`);
      await Product.updateOne(
        { _id: req.params._id },
        {
          $set: {
            "images.1": ImageName,
          },
        }
      );
    }
    if (req.files.image3) {
      const ImageName = req.body.product_title + "3-" + Date.now() + ".jpg";
      sharp(`./public/images/product_images/${req.files.image3[0].filename}`)
        .resize(300, 300)
        .jpeg({ quality: 50 })
        .toFile(`./public/images/processed_images/${ImageName}`);
      await Product.updateOne(
        { _id: req.params._id },
        {
          $set: {
            "images.2": ImageName,
          },
        }
      );
    }
    if (req.files.image4) {
      const ImageName = req.body.product_title + "4-" + Date.now() + ".jpg";
      sharp(`./public/images/product_images/${req.files.image4[0].filename}`)
        .resize(300, 300)
        .jpeg({ quality: 50 })
        .toFile(`./public/images/processed_images/${ImageName}`);
      await Product.updateOne(
        { _id: req.params._id },
        {
          $set: {
            "images.3": ImageName,
          },
        }
      );
    }
    return res.redirect("/admin/products/");
  } catch (error) {
    console.log(error);
    return res.redirect("/admin/errorPage/");
  }
}

async function deleteProduct(req, res) {
  try {
    await Product.updateOne(
      { _id: req.params._id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    return res.redirect("/admin/products");
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

async function categories(req, res) {
  try {
    const categories = await Category.find();
    return res.render("admin/category", { categories });
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

function addcategory(req, res) {
  try {
    return res.render("admin/add-category", { message: null });
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

async function postaddCategory(req, res) {
  try {
    let category = req.body.categoryname;
    let check = await Category.findOne({
      categoryname: { $regex: category, $options: "i" },
    });
    if (check) {
      return res.render("admin/add-category", {
        message: "category already exists",
      });
    } else {
      if (
        req.file.mimetype === "image/jpeg" ||
        req.file.mimetype === "image/jpg"
      ) {
        const ImageName = req.body.categoryname + "4-" + Date.now() + ".jpg";
        sharp(`./public/images/product_images/${req.file.filename}`)
          .resize(300, 300)
          .jpeg({ quality: 50 })
          .toFile(`./public/images/processed_images/${ImageName}`);
  
        const category = new Category({
          categoryname: req.body.categoryname,
          categoryImage: ImageName,
        });
        await category.save();
        return res.redirect("/admin/categories");
      } else {
        return res.render("admin/add-category", {
          message: "cannot upload files of format other than jpg or jpeg",
        });
      }
    }
  } catch (error) {
    console.log(error);

    return res.redirect("/admin/errorPage");
  }
}

async function editCategory(req, res) {
  try {
    let category = await Category.findById({ _id: req.params._id });

    return res.render("admin/edit-category", { category:category,message:null });
  } catch (error) {

    return res.redirect("/admin/errorPage");
  }
}

async function postEditCategory(req, res) {
  try {
    let category = await Category.findById({ _id: req.params._id });

    await Category.updateOne(
      { _id: req.params._id },
      {
        $set: {
          categoryname: req.body.categoryname,
        },
      }
    );

    // console.log(req.file);
    if (req.file) {
      if (
        req.file.mimetype == "image/jpeg" ||
        req.file.mimetype == "image/jpg"
      ) {
        const ImageName = req.body.categoryname + "4-" + Date.now() + ".jpg";
      sharp(`./public/images/product_images/${req.file.filename}`)
        .resize(300, 300)
        .jpeg({ quality: 50 })
        .toFile(`./public/images/processed_images/${ImageName}`);

        await Category.updateOne(
          { _id: req.params._id },
          {
            $set: {
              "categoryImage": ImageName,
            },
          }
        );
        return res.redirect("/admin/categories");


      }else{
        return res.render("admin/edit-category", {
          category: category,
          message: "only .jpg and .jped formats are supported",
        });
      }
    }
    res.redirect('/admin/categories/')
  } catch (error) {
    console.log(error);
    return res.redirect("/admin/errorPage");
  }
}
async function customers(req, res) {
  try {
    const admin = await User.find();
    return res.render("admin/customers", { admin });
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

async function unblock(req, res) {
  try {
    await User.updateOne(
      { _id: req.params._id },
      {
        $set: {
          blocked: false,
        },
      }
    );
    return res.redirect("/admin/customers");
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

async function block(req, res) {
  try {
    await User.updateOne(
      { _id: req.params._id },
      {
        $set: {
          blocked: true,
        },
      }
    );
    return res.redirect("/admin/customers");
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

async function coupons(req, res) {
  try {
    coupons = await Coupon.find({isDeleted:false});
    return res.render("admin/coupon", { coupons,moment });
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

function addcoupon(req, res) {
  try {
    return res.render("admin/add-coupon");
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

async function postaddcoupon(req, res) {
  try {
    let check = await Coupon.findOne({
      couponName: { $regex: `${req.body.couponName}`, $options: "i" },
    });
    if (check) {
      // console.log("coupon already exisnts");
      return res.render("admin/add-coupon", {
        message: "coupon already exists",
      });
    } else {
      const coupon = new Coupon({
        couponName: req.body.coupon_name,
        couponCode: req.body.couponCode,
        discount: req.body.discount,
        minAmount:minAmount,
        maxAmount:maxAmount,
        startingDate : req.body.startingDate,
        expiryDate : req.body.expiryDate,
        
      });
      await coupon.save();
      return res.redirect("/admin/coupons");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/admin/errorPage");
  }
}

async function editCoupon(req,res){
  try {
    let coupons = await Coupon.findOne({_id:req.params._id})
    return res.render("admin/edit-coupon",{coupons});
  } catch (error) {
    console.log(error);
    return res.redirect("/admin/errorPage");
  }
}
async function postEditCoupon(req,res){
  try {
    await Coupon.updateOne({_id:req.params._id},
      {
        $set:{
          couponName: req.body.coupon_name,
          couponCode: req.body.couponCode,
          discount : req.body.discount,
          minAmount:req.body.minAmount,
          maxAmount:req.body.maxAmount,
          startingDate: req.body.startingDate,
          expiryDate: req.body.expiryDate,
        }
      })

    return res.redirect("/admin/coupons");
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

async function Activate(req,res){
  try {
    const coupon = await Coupon.findOne({_id:req.params._id})
if(coupon.active===true){
await Coupon.updateOne({_id:req.params._id},
  {
    $set:{
      active:false
    }
  })
}else{
  await Coupon.updateOne({_id:req.params._id},
    {
      $set:{
        active:true
      }
    })
}
return res.redirect('/admin/coupons')
  } catch (error) {
    console.log(error);
    return res.redirect("/admin/errorPage");
  }

}

async function deleteCoupon(req,res){
  try {
    await Coupon.updateOne({_id:req.params._id},
      {$set:{
        isDeleted: true
      }})
    return res.redirect('/admin/coupons')
  } catch (error) {
    console.log(error);
    return res.redirect("/admin/errorPage");
  }
}
async function showCoupons(req, res) {
  try {
    return res.render("admin/coupon", { coupons });
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

async function userOrders(req, res) {
  try {
    
    const orders1 = await Order.find({}).populate("orderedItems.productid").sort({orderDate : -1})
console.log(orders1);
    return res.render("admin/orders", { orders1 ,moment});
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}
async function postUserOrders(req,res){
  try {
    console.log(req.body);
    await Order.updateOne({_id:req.body.orderId},
      {$set:{
        orderStatus:req.body.orderStatus
      }})
      return res.redirect('/admin/userOrders')
  } catch (error) {
    console.log(error)
    return res.redirect("/admin/errorPage");

  }
}
async function orderDetails(req,res) {
  try {
    const orders = await Order.findById({_id:req.params._id}).populate("orderedItems.productid").sort({orderDate : -1})
    console.log(orders);
return res.render("admin/orderDetails",{orders,moment})
  } catch (error) {
    console.log(error); 
    return res.redirect("/admin/errorPage");
    
  }
}



function logout(req, res) {
  try {
    req.session.destroy();
    return res.redirect("/admin");
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

async function bannerManagement(req, res) {
  try {
    const banners= await Banner.find({isDeleted:false})
    // console.log(banners);
    return res.render("admin/bannermanagement",{banners:banners,message:null});
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

async function postBannerManagement(req, res) {
  try {
    const banners= await Banner.find()
    if(req.file.mimetype=='image/jpeg' || req.file.mimetype=='image/jpeg' ){
      const ImageName = req.file.fieldname + "-" + Date.now() + ".jpg";
      sharp(`./public/images/product_images/${req.file.filename}`)
      .resize(1200, 410)
      .toFile(`./public/images/processed_images/${ImageName}`);
const banner = new Banner({
    image:ImageName,
    inUse:false,
    isDeleted:false
  })
    banner.save() 
    }else{
      return res.render("admin/bannermanagement",{banners:banners,message:"Only .jpg or .jpeg formats are supported"});
    }
    return res.redirect("/admin/bannerManagement");
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

async function usebanner(req,res) {
  try {
    bannerId =req.params._id;
    banner = await Banner.findOne({_id:bannerId})
    if (banner.inUse===true) {
      await Banner.updateOne({_id:bannerId},
        {$set:{
          inUse:false
        }})
    } else {
      await Banner.updateOne({_id:bannerId},
        {$set:{
          inUse:true
        }})
    }
    return res.redirect('/admin/bannerManagement/')
  } catch (error) {
    return res.redirect("/admin/errorPage");
  }
}

async function deletebanner(req,res){
  bannerId =req.params._id;
  banner = await Banner.findOne({_id:bannerId})
  await Banner.updateOne({_id:bannerId},
    {$set:{
      isDeleted:true
    }})
    return res.redirect('/admin/bannerManagement/')

}
function errorPage(req, res) {
  return res.render("admin/500page");
}
function notFound(req, res) {
  return res.render("admin/404page");
}

module.exports = {
  adminLogin,
  postAdminLogin,
  dashboard,
  graph,
  customers,
  categories,
  orderDetails,
  addcategory,
  postaddCategory,
  editCategory,
  postEditCategory,
  products,
  add_products,
  postadd_products,
  editProduct,
  posteditProduct,
  deleteProduct,
  unblock,
  block,
  coupons,
  addcoupon,
  postaddcoupon,
  editCoupon,
  postEditCoupon,
  deleteCoupon,
  Activate,
  showCoupons,
  userOrders,
  postUserOrders,
  bannerManagement,
  usebanner,
  deletebanner,
  postBannerManagement,
  
  errorPage,
  notFound,
  logout,
};
