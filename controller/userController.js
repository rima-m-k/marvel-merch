const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const Swal = require("sweetalert2");
const moment = require('moment');
const paypal = require('paypal-rest-sdk');

const User = require("../model/userschema");
const Product = require("../model/productschema");
const Category = require("../model/categoryschema");
const Wishlist = require("../model/wishlistschema");
const Cart = require("../model/cartschema");
const Order = require("../model/orderschema");
const Coupon = require("../model/couponschema");
const Banner = require("../model/bannerschema");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();



async function landingPage(req, res) {
  try {
    let category = await Category.find();
    let products = await Product.find({isDeleted: false}).sort({$natural:-1}).limit(16);
    let banners = await Banner.find({ inUse: true, isDeleted: false });
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    return res.render("user/landingpage", { category, products, banners ,activeSession,showName});
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function userSignup(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    return res.render("user/signup",{activeSession,showName});
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function postuserSignup(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
     let user = await User.findOne({ email: req.body.email });
    if (user) {
      res.render("user/signup", { message: "email already taken" ,activeSession,showName});
    } else {
      user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        password: await bcryptjs.hash(req.body.password, 10),
        blocked: false,
        addresses: [],
      });
      req.session.createUser = user
      const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;
      req.session.OTP = OTP
      var transporter = nodemailer.createTransport({
        service: " gmail",
        auth: {
          user: "marvelmerch806@gmail.com",
          pass: "yzdjivmydvsuvgbd",
        },
      });
      var mailOptions = {
        from: "marvelmerch806@gmail.com",
        to: req.body.email,
        subject: " otp for registration",
        text: `${OTP} `,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.render("user/signup", { message: "Email doesn't exist",activeSession ,showName});
        } else {
          console.log("Email sent" + info.response);
          console.log(OTP);
          
          return res.render("user/otp",{activeSession,showName});
        }
      });
    }
  } catch (error) {
    res.redirect("/errorPage");
  }
}

async function postverifyotp(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    const OTP = req.session.OTP
    let user = req.session.createUser
    if (OTP === req.body.otp_code) {
      await user.save();
      req.session.usersession = user._id;

      let cartobj = new Cart({
        userid: mongoose.Types.ObjectId(user),
        product: [],
      });
      cartobj.save();
      let wishlistObj = new Wishlist({
        userid: mongoose.Types.ObjectId(user),
        product: [],
      });
      await wishlistObj.save();
      return res.redirect("/");
    } else {
      return res.render("user/otp", { message: "Incorrect OTP" ,activeSession,showName});
    }
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function login(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    return res.render("user/login",{activeSession,showName});
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function postlogin(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    let user = await User.findOne({ email: req.body.email });
    if (user == null) {
      return res.render("user/login", {message: "user not found, please signup",activeSession,showName});
    } else {
      if (user.blocked === true) {
        return res.render("user/login", {message: "This email id has been blocked",activeSession,showName});
      } else {
        const comparepassword = await bcryptjs.compare(
          req.body.password,
          user.password
        );

        if (comparepassword) {
          req.session.usersession = user._id;
          return res.redirect("/");
        } else {
          return res.render("user/login", { message: "Incorrect  password",activeSession ,showName});
        }
      }
    }
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function forgotpassword(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    return res.render("user/forgotpassword",{activeSession,showName});
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function getemail(req, res) {
  try {
    let UserForFP = User.findOne({ email: req.body.emailForForgotPassword });
    req.session.UserForFP = UserForFP
     let email=UserForFP.email
     
      const otpForForgotPassword = `${Math.floor(1000 + Math.random() * 9000)}`;
      
      req.session.otpForForgotPassword =otpForForgotPassword
      console.log(req.session.otpForForgotPassword);
    var transporter = nodemailer.createTransport({
      service: " gmail",
      auth: {
        user: "marvelmerch806@gmail.com",
        pass: "yzdjivmydvsuvgbd", 
      },
    });
    var mailOptions = {
      from: "marvelmerch806@gmail.com",
      to: req.body.emailForForgotPassword,
      subject: " forgotpassword",
      text: `${otpForForgotPassword} `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent" + info.response);
        console.log(otpForForgotPassword);
        res.json({success:true,email:email})
      }
    });
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function postforgotpassword(req, res) {
  try {
    
    let otpForForgotPassword = await req.session.otpForForgotPassword;
    console.log("req.session.otpForForgotPassword    "+req.session.otpForForgotPassword);
    console.log("otpForForgotPassword    "+otpForForgotPassword);
    if (otpForForgotPassword === req.body.FPOtp) {
      req.session.otpForForgotPassword = null
      res.json({success:true})

    } else {
      res.json({success:false,message: "invalid OTP"})

    }
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function postchangepassword(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    UserForFP  = req.session.UserForFP 

    if (req.body.changepassword === req.body.confirmpassword) {
      User.updateOne(
        { email: UserForFP.email },
        {
          $set: {
            password: await bcryptjs.hash(req.body.changepassword, 10),
          },
        }
      );
      console.log("password reset");
      return res.redirect("/");
    } else {
      return res.render("user/changepassword", {message: "passwords must be same",activeSession,showName});
    }
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function productdisplay(req, res) {
  try {
    // if(req.session.usersession){
      let activeSession =0;
      let showName = null;
      if(req.session.usersession){
      activeSession=1;
       showName = await User.find({_id:req.session.usersession},{firstname:1});
      }
    let flag;
    productdetails = await Product.findById(req.params._id);
    if (req.session.usersesion) {
      flag = true;
    } else {
      flag = false;
    }
    return res.render("user/product-details", { productdetails, flag,activeSession,showName });
    // }
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function showitems(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    const categoryID = req.params._id;
    let items = await Product.find({ product_category: categoryID });
    let category = await Category.find({ _id: categoryID });
    return res.render("user/product-list", { items, category ,activeSession,showName});
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function showcart(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    let userId = req.session.usersession;
    const cartlist = await Cart.aggregate([
      {
        $match: { userid: new mongoose.Types.ObjectId(userId) },
      },
      {
        $unwind: "$product",
      },
      {
        $lookup: {
          from: "products",
          localField: "product.productid",
          foreignField: "_id",
          as: "cartdetails",
        },
      },
      {
        $project: {
          singlePrice: "$cartdetails.price",
          productName: "$cartdetails.product_title",
          productImage: "$cartdetails.images",
          productId: "$cartdetails._id",
          productQuatity: "$product.quantity",
          totalPrice: {
            $multiply: [
              "$product.quantity",
              { $arrayElemAt: ["$cartdetails.price", 0] },
            ],
          },
        },
      },
    ]);
    let flag;
    // console.log("len"+cartlist.length);

    if(cartlist.length==0){
      flag=1;
    } else{
       flag = 2;
    }
      
    // console.log(flag);
    const subtotal = cartlist.reduce((acc, cur) => {
      acc = acc + cur.totalPrice;
      return acc;
    }, 0);
    const totalOfQuantity = cartlist.reduce((acc, cur) => {
      acc = acc + cur.productQuatity;
      return acc;
    }, 0);
    return res.render("user/cart", { cartlist, subtotal, totalOfQuantity,activeSession,showName ,flag});
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function addToCart(req, res) {
  try {
    if (req.session.usersession) {
      proId = req.params._id;
      userInCart = req.session.usersession;
      //check if it exist in wishlist
      const wishlistItems = await Wishlist.findOne({
        userid: mongoose.Types.ObjectId(userInCart),
      });
      let productExistsinWishlist = wishlistItems.product.findIndex(
        (prod) => prod.productid == proId
      );
      if (productExistsinWishlist != -1) {
        //remove from wishlist
        await Wishlist.updateOne(
          { userid: mongoose.Types.ObjectId(userInCart) },
          {
            $pull: {
              product: { productid: mongoose.Types.ObjectId(proId) },
            },
          }
        );
      }
      //check product in cart
      pro = await Product.findById(proId);
      const cartItems = await Cart.findOne({
        userid: mongoose.Types.ObjectId(userInCart),
      });
      let productExists = cartItems.product.findIndex(
        (prod) => prod.productid == proId
      );
      //-1 means that product doesnt exist. 1 means it exists
      if (productExists != -1) {
        //code to increase quantity
        productInCart = await Cart.findOne({
          userid: mongoose.Types.ObjectId(userInCart),
          "product.productid": mongoose.Types.ObjectId(proId),
        });
        await Cart.updateOne(
          {
            userid: mongoose.Types.ObjectId(userInCart),
            "product.productid": mongoose.Types.ObjectId(proId),
          },
          {
            $inc: {
              "product.$.quantity": 1,
            },
          }
        );
        //decrease stock
        await Product.updateOne({_id:proId},
          {
            
              $inc: {
                "stock": -1,
              },
            
          })
      } else {
        //product doesnt exist in cart so push product to cart
        await Cart.updateOne(
          { userid: req.session.usersession },
          {
            $set: {
              totalQty: 1,
            },
            $push: {
              product: {
                productid: mongoose.Types.ObjectId(proId),
                quantity: 1,
              },
            },
          }
        );
        await Product.updateOne({_id:proId},
          {
            
              $inc: {
                "stock": -1,
              },
            
          })
      }
      res.json({
        success: true,
      });
    } else {
      res.json({
        success: false,
      });
    }
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function changeProductQuantity(req, res) {
  try {
    if (req.body.count == -1 && req.body.quantity == 1) {
      await Cart.updateOne(
        { _id: mongoose.Types.ObjectId(req.body.cartId) },
        {
          $pull: {
            product: { productid: mongoose.Types.ObjectId(req.body.productId) },
          },
        }
      );
      res.json(true);
    } else {
      await Cart.updateOne(
        {
          _id: mongoose.Types.ObjectId(req.body.cartId),
          "product.productid": mongoose.Types.ObjectId(req.body.productId),
        },
        {
          $inc: { "product.$.quantity": req.body.count },
        }
      );
      res.json(false);
    }
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function removeCartItem(req, res) {
  try {
    await Cart.updateOne(
      { _id: mongoose.Types.ObjectId(req.body.cartId) },
      {
        $pull: {
          product: { productid: mongoose.Types.ObjectId(req.body.productId) },
        },
      }
    );
    //put stock back
    res.json(true);
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function couponCheck (req, res) {
  let userId = req.session.usersession;

  const cart = await Cart.findOne({userid : req.session.usersession})
  const cartlist = await Cart.aggregate([
    {
      $match: { userid: new mongoose.Types.ObjectId(userId) },
    },
    {
      $unwind: "$product",
    },
    {
      $lookup: {
        from: "products",
        localField: "product.productid",
        foreignField: "_id",
        as: "cartdetails",
      },
    },
    {
      $project: {
        singlePrice: "$cartdetails.price",
        productName: "$cartdetails.product_title",
        productImage: "$cartdetails.images",
        productId: "$cartdetails._id",
        productQuatity: "$product.quantity",
        totalPrice: {
          $multiply: [
            "$product.quantity",
            { $arrayElemAt: ["$cartdetails.price", 0] },
          ],
        },
      },
    },
  ]);
  const subtotal = cartlist.reduce((acc, cur) => {
    acc = acc + cur.totalPrice;
    return acc;
  }, 0);
  const code = req.body.code
  const coupon = await Coupon.findOne({couponCode : code})
  
  if(code != ''){
    if(coupon){
      let discount = (subtotal*coupon.discount)/100
      let finalPrice = subtotal - discount
      // console.log(finalPrice);
      // console.log('coupon applied');

      res.json({
        data : {
          correctCoupon : `${coupon.couponName} <b> Coupon Applied </b>`,
          discount,
          totalPrice : finalPrice
        }
      })
    }else{
      // console.log('coupon not found');
      res.json({
        data : {
          correctCoupon : "Coupon not found",
        discount : 0,
        totalPrice : subtotal
        }
      })
    }
    
  }else{
    // console.log('coupon blank');

    res.json({
      data : {
        correctCoupon : '',
        discount : 0,
        totalPrice : subtotal
      }
    })
  }
  
}
async function checkout(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    let userId = req.session.usersession;

    let address = await User.find(
      { _id: req.session.usersession },
      { addresses: 1 }
    );
    const Address = address[0].addresses;

    const cartlist = await Cart.aggregate([
      {
        $match: { userid: new mongoose.Types.ObjectId(userId) },
      },
      {
        $unwind: "$product",
      },
      {
        $lookup: {
          from: "products",
          localField: "product.productid",
          foreignField: "_id",
          as: "cartdetails",
        },
      },
      {
        $project: {
          singlePrice: "$cartdetails.price",
          productName: "$cartdetails.product_title",
          productImage: "$cartdetails.images",
          productId: "$cartdetails._id",
          productQuatity: "$product.quantity",
          totalPrice: {
            $multiply: [
              "$product.quantity",
              { $arrayElemAt: ["$cartdetails.price", 0] },
            ],
          },
        },
      },
    ]);
    const subtotal = cartlist.reduce((acc, cur) => {
      acc = acc + cur.totalPrice;
      return acc;
    }, 0);
    const totalOfQuantity = cartlist.reduce((acc, cur) => {
      acc = acc + cur.productQuatity;
      return acc;
    }, 0);
    return res.render("user/checkout", {
      Address,
      subtotal,
      cartlist,
      totalOfQuantity,
      activeSession,
      showName
    });
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function profile(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    return res.render("user/profile",{activeSession,showName});
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function showAddress(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    let address = await User.find(
      { _id: req.session.usersession },
      { addresses: 1 }
    );
    const Address = address[0].addresses;

    return res.render("user/user-address", { Address ,activeSession,showName});
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function addAddress(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    return res.render("user/add-address", { message: null ,activeSession,showName});
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function postAddAddress(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    if (isNaN(req.body.mobile_no) && isNaN(req.body.pincode)) {
      return res.render("user/add-address", {
        message: "please enter correct mobile number and pin number",
        activeSession,
        showName
      });
    } else {
      await User.updateOne(
        { _id: req.session.usersession },
        {
          $push: {
            addresses: {
              address_name: req.body.address_name,
              user_name: req.body.user_name,
              house_no: req.body.house_no,
              mobile_no: req.body.mobile_no,
              village: req.body.village,
              country: req.body.country,
              city: req.body.city,
              state: req.body.state,
              landmark: req.body.landmark,
              pincode: req.body.pincode,
              isdefault: false,
            },
          },
        }
      );
    }
    return res.redirect("/addresses");
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function editAddress(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    let address = await User.find({ _id: req.session.usersession });

    const Address = address[0].addresses;

    let selectedAddress = await Address.findIndex(
      (index) => index._id == req.params._id
    );

    return res.render("user/editaddress", {
      address: Address[selectedAddress],
      activeSession,
      showName
    });
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function removeAddress(req, res) {
  try {
        let a = await User.updateOne(
      { _id: req.session.usersession },
      {
        $pull: { addresses: { _id: req.params._id } },
      }
    );
    return res.redirect("/addresses");
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function postEditAddress(req, res) {
  try {
    await User.updateOne(
      { _id: req.session.usersession, "addresses._id": req.params._id },
      {
        $set: {
          "addresses.$.address_name": req.body.address_name,
          "addresses.$.user_name": req.body.user_name,
          "addresses.$.house_no": req.body.house_no,
          "addresses.$.mobile_no": req.body.mobile_no,
          "addresses.$.village": req.body.village,
          "addresses.$.country": req.body.country,
          "addresses.$.city": req.body.city,
          "addresses.$.state": req.body.state,
          "addresses.$.landmark": req.body.landmark,
          "addresses.$.pincode": req.body.pincode,
        },
      }
    );
    return res.redirect("/addresses");
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function placeOrder(req, res) {
  try {
    // console.log(req.body);
    const user = await User.find({ _id: req.session.usersession });

    const Address = user[0].addresses;
    
    const cartdetails = await Cart.findOne({
      userid: mongoose.Types.ObjectId(req.session.usersession),
    }).populate("product.productid");

        if (req.body.paymentMethod === "COD") {
          // console.log(req.body);
          let deliveryAddress;
          if(req.body.addressId){
          if(req.body.addressId != ''){
            // console.log(req.body.addressId);
            let user = await User.find({ _id: req.session.usersession });
// console.log("user"+user);
            const Address = user[0].addresses;
        // console.log("Address"+Address);
            let selectedAddress = await Address.findIndex(
              (index) => index._id == req.body.addressId
            );
        // console.log("selectedAddress"+selectedAddress);
//push
             deliveryAddress= {
              address_name:Address[selectedAddress].address_name,
              user_name:Address[selectedAddress].user_name,
              house_no:Address[selectedAddress].house_no,
              mobile_no:Address[selectedAddress].mobile_no,
              village:Address[selectedAddress].village,
              country:Address[selectedAddress].country,
              city:Address[selectedAddress].city,
              state:Address[selectedAddress].state,
              landmark:Address[selectedAddress].landmark,
              pincode:Address[selectedAddress].pincode,
              }
            
          }
        }else if(req.body.address_name !=''){
             deliveryAddress= {
            address_name:req.body.address_name,
            user_name:req.body.user_name,
            house_no:req.body.house_no,
            mobile_no:req.body.mobile_no,
            village:req.body.village,
            country:req.body.country,
            city:req.body.city,
            state:req.body.state,
            landmark:req.body.landmark,
            pincode:req.body.pincode,
            }

            //add new address to database 
            await User.updateOne(
              { _id: req.session.usersession },
              {
                $push: {
                  addresses: {
                    address_name: req.body.address_name,
                    user_name: req.body.user_name,
                    house_no: req.body.house_no,
                    mobile_no: req.body.mobile_no,
                    village: req.body.village,
                    country: req.body.country,
                    city: req.body.city,
                    state: req.body.state,
                    landmark: req.body.landmark,
                    pincode: req.body.pincode,
                    isdefault: false,
                  },
                },
              }
            );

          }else{
            console.log("error");
          }
          const order = new Order({
            userId: mongoose.Types.ObjectId(req.session.usersession),
            name: user[0].firstname + " " + user[0].lastname,
            phone: user[0].phone,
            deliveryAddress:deliveryAddress,
            totalAmount: req.body.Subtotal,
            paidAmount: req.body.totalPrice,
            orderStatus: "Placed",
            discountPrice : req.body.discount,
            paymentMethod: req.body.paymentMethod,
            orderDate: Date.now(),
            deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 10),
          });
          await order.save();
          
          for (let i = 0; i < cartdetails.product.length; i++) {
            await Order.updateOne(
              {
                _id: order._id,
              },
              {
                $push: {
                  "orderedItems": {
                    productid: cartdetails.product[i].productid._id,
                    qty: cartdetails.product[i].quantity,
                  },
                },
              }
            );
          }
  
          await Cart.updateOne(
            { userid: mongoose.Types.ObjectId(req.session.usersession) },
            {
              $set: { product: [] },
            }
          );
  res.json({data:1});

        } else if (req.body.paymentMethod === "paypal") { 

console.log(req.body)
          paypal.configure({
            'mode': 'sandbox', //sandbox or live
            'client_id': 'AaauMdWzXcMYJ4O-E52wRkpb3KLrFi5744tKaCMhHp2bjHttTLHU6JdcXebLrAO6aZ4ods2ocZ1NY_Wj',
            'client_secret': 'EBs9SM2WMgLaVycxwETdGdnPwh6-zUAclYLTlmKuW_6Ged7gbnXM1-HAj0G2xlEaqRiw2kdE-0Dvvk_F'
          });
         
          const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
              "return_url": "http://localhost:8000/orderSuccess",
              "cancel_url": "http://localhost:8000/orderFail"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Red Sox Hat",
                        "sku": "001",
                        "price": req.body.totalPrice,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": req.body.totalPrice
                },
                "description": "Hat for the best team ever"
            }]
        };


        paypal.payment.create(create_payment_json, async function (error, payment) {
          if (error) {
              throw error;
          } else {
              for(let i = 0;i < payment.links.length;i++){
                if(payment.links[i].rel === 'approval_url'){
                  // await cartCollection.updateOne({user:req.cookies.id},{$unset:{couponDiscount:""}})
                  console.log(payment.links[i].href);
                  res.json({data:payment.links[i].href})
                }
              }
          }
        });
        let deliveryAddress;
        if(req.body.addressId){
        if(req.body.addressId != ''){
          // console.log(req.body.addressId);
          let user = await User.find({ _id: req.session.usersession });
// console.log("user"+user);
          const Address = user[0].addresses;
      // console.log("Address"+Address);
          let selectedAddress = await Address.findIndex(
            (index) => index._id == req.body.addressId
          );
      // console.log("selectedAddress"+selectedAddress);
//push
           deliveryAddress= {
            address_name:Address[selectedAddress].address_name,
            user_name:Address[selectedAddress].user_name,
            house_no:Address[selectedAddress].house_no,
            mobile_no:Address[selectedAddress].mobile_no,
            village:Address[selectedAddress].village,
            country:Address[selectedAddress].country,
            city:Address[selectedAddress].city,
            state:Address[selectedAddress].state,
            landmark:Address[selectedAddress].landmark,
            pincode:Address[selectedAddress].pincode,
            }
          
        }
      }else if(req.body.address_name !=''){
           deliveryAddress= {
          address_name:req.body.address_name,
          user_name:req.body.user_name,
          house_no:req.body.house_no,
          mobile_no:req.body.mobile_no,
          village:req.body.village,
          country:req.body.country,
          city:req.body.city,
          state:req.body.state,
          landmark:req.body.landmark,
          pincode:req.body.pincode,
          }

          //add new address to database 
          await User.updateOne(
            { _id: req.session.usersession },
            {
              $push: {
                addresses: {
                  address_name: req.body.address_name,
                  user_name: req.body.user_name,
                  house_no: req.body.house_no,
                  mobile_no: req.body.mobile_no,
                  village: req.body.village,
                  country: req.body.country,
                  city: req.body.city,
                  state: req.body.state,
                  landmark: req.body.landmark,
                  pincode: req.body.pincode,
                  isdefault: false,
                },
              },
            }
          );

        }else{
          console.log("error");
        }
        const order = new Order({
          userId: mongoose.Types.ObjectId(req.session.usersession),
          name: user[0].firstname + " " + user[0].lastname,
          phone: user[0].phone,
          deliveryAddress:deliveryAddress,
          totalAmount: req.body.Subtotal,
          paidAmount: req.body.totalPrice,
          orderStatus: "Placed",
          discountPrice : req.body.discount,
          paymentMethod: req.body.paymentMethod,
          orderDate: Date.now(),
          deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10),
        });
        await order.save();
        
        for (let i = 0; i < cartdetails.product.length; i++) {
          await Order.updateOne(
            {
              _id: order._id,
            },
            {
              $push: {
                "orderedItems": {
                  productid: cartdetails.product[i].productid._id,
                  qty: cartdetails.product[i].quantity,
                },
              },
            }
          );
        }

        await Cart.updateOne( 
          { userid: mongoose.Types.ObjectId(req.session.usersession) },
          {
            $set: { product: [] },
          }
        );
// res.json({data:1});


        } else {
          
        }
        
  } catch (error) {
    console.log(error);
    return res.redirect("/errorPage");
  }
}

async function orderList(req,res){
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    const orders1 = await Order.find({
      userId: req.session.usersession,
    }).populate("orderedItems.productid").sort({orderDate : -1})
    // console.log(orders1);

    return res.render("user/orderlist", { orders1,moment ,activeSession,showName}); 
   } catch (error) {
    console.log(error);
    return res.redirect("/errorPage");

    
  } 
}

async function orderSuccess(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    return res.render("user/order-success",{activeSession,showName});
  } catch (error) {
    return res.redirect("/errorPage");
  }
}


 async function orderFail(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    return res.render("user/order-fail",{activeSession,showName});
  } catch (error) {
    return res.redirect("/errorPage");
  }
}
async function viewOrders(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    const orders1 = await Order.find({
      userId: req.session.usersession,
    }).populate("orderedItems.productid").sort({orderDate : -1})
    // console.log(orders1);

    return res.render("user/viewOrders", { orders1,moment ,activeSession,showName});
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function cancelOrder (req, res){
  try {
    await Order.updateOne({_id : req.body.orderid},{
      orderStatus : "Cancelled"
    })
    res.json({
      success : true
    })
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function postViewOrders(req, res) {
  try {
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function addtoWishlist(req, res) {
  try {
    userId = req.session.usersession;
    productId = req.params._id;

    pro = await Product.findById(productId);
    const cartItems = await Cart.findOne({
      userid: mongoose.Types.ObjectId(userId),
    });
    let productExistsInCart = cartItems.product.findIndex(
      (prod) => prod.productid == productId
    );
    //-1 means that product doesnt exist. 1 means it exists
    if (productExistsInCart != -1) {
      //product already in cart
    } else {
      // check the product in wishlist
      const wishlistItems = await Wishlist.findOne({
        userid: mongoose.Types.ObjectId(userId),
      });
      let productExistsinWishlist = wishlistItems.product.findIndex(
        (prod) => prod.productid == productId
      );
      if (productExistsinWishlist != -1) {
        Swal.fire("item already exists in wishlist");
        res.json(true);
      } else {
        await Wishlist.updateOne(
          { userid: userId },
          {
            $push: {
              product: {
                productid: mongoose.Types.ObjectId(productId),
              },
            },
          }
        );
        res.json(false);
      }
    }
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function removeFromWishlist(req, res) {
  try {
    await Wishlist.updateOne(
      { _id: mongoose.Types.ObjectId(req.body.wishlistID) },
      {
        $pull: {
          product: { productid: mongoose.Types.ObjectId(req.body.productId) },
        },
      }
    );
    res.json(true);
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function moveToCart(req, res) {
  try {
    const cartItems = await Cart.findOne({
      userid: mongoose.Types.ObjectId(req.session.usersesion),
    });
    let productExists = cartItems.product.findIndex(
      (prod) => prod.productid == productID
    );
    await Wishlist.updateOne(
      { _id: mongoose.Types.ObjectId(req.body.wishlistID) },
      {
        $pull: {
          product: { productid: mongoose.Types.ObjectId(req.body.productID) },
        },
      }
    );
    if (productExists != -1) {
    } else {
      await Cart.updateOne(
        { userid: req.session.usersession },
        {
          $push: {
            product: {
              productid: mongoose.Types.ObjectId(req.body.productID),
              quantity: 1,
            },
          },
        }
      );
    }
    res.json(true);
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function showWishlist(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    const wishlist = await Wishlist.aggregate([
      {
        $match: {
          userid: new mongoose.Types.ObjectId(req.session.usersession),
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "products",
          localField: "product.productid",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $project: {
          _id: 1,
          singlePrice: "$product.price",
          productName: "$product.product_title",
          productImage: "$product.images",
          productId: "$product._id",
        },
      },
    ]);
    return res.render("user/wishlist", { wishlist ,activeSession,showName});
  } catch (error) {
    return res.redirect("/errorPage");
  }
}

async function loginSecurity(req,res){
  try{
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    const user = await User.findOne({_id:req.session.usersession})

    return res.render('user/login-security',{user,activeSession,showName})
  }catch(error){
    return res.redirect("/errorPage");

  }
}

async function postLoginSecurity(req,res){
  try{
    console.log(req.body);

   let  formData = req.body.formData;
  let x= await User.updateOne({_id:formData.UID},
    {
      $set:{
      firstname:formData.firstname,
      lastname:formData.lastname,
      phone:formData.phone,
      }
    })
console.log(x)
    userDetails = await User.findById({_id:formData.UID})
    console.log(userDetails);
    res.json({
      success:1,
      user:{firstname:userDetails.firstname,lastname:userDetails.lastname,phone:userDetails.phone},
    })

//     currentUser = await User.findById(req.body.userId);
//     const comparepassword = await bcryptjs.compare(
//       req.body.current_password,
//       currentUser.password
//     );
//     console.log(comparepassword);
// if(comparepassword){
// res.json({data:"match"})
// }else{
//   res.json({data:"notmatch"})
// }
// let enteredOTP = req.body.form_data.Otp


  }catch(error){
    return res.redirect("/errorPage");

  }
}
async function shop(req, res) {
  try {
    let activeSession =0;
    let showName = null;
    if(req.session.usersession){
    activeSession=1;
     showName = await User.find({_id:req.session.usersession},{firstname:1});
    }
    req.session.displayProducts = await Product.find({ isDeleted: false });
    let allCategory = await Category.find();
    return res.render("user/shop", { allProducts:req.session.displayProducts ,activeSession,showName,allCategory}); 
  } catch (error) {
    console.log(error)
    return res.redirect("/errorPage");
  }
}

async function search (req,res) { 
  try {
  console.log("searched Products start      "+req.session.displayProducts.length); 
  const searchTerm = req.query.searchInput;
  console.log("searchTerm       "+searchTerm); 
   let allProducts = await Product.find({product_title: { $regex: `${searchTerm}`, $options: "i" }}); 
   req.session.displayProducts = allProducts
  console.log("searched Products end    "+req.session.displayProducts.length); 
  
    res.json({
     success:1 ,
     searchedProducts:allProducts
    })
  } catch (error) {
    console.log(error) 
    return res.redirect("/errorPage");
    
  }

}

async function filter(req,res){
  try {
   let categoryID = req.body.categoryID
   console.log(categoryID)
   filteredProducts = await Product.find({product_category:categoryID,isDeleted:false})
   console.log(filteredProducts.product_title);
   res.json({
    filteredProducts:filteredProducts,
   })
    
  } catch (error) {
    console.log(error);
    return res.redirect("/errorPage");
  }
}

async function sort(req,res){
  try {

 let criteria = req.body.criteria;
 let sortedProducts;
 if(criteria==='A-Z'){
   sortedProducts = await Product.find({isDeleted:false}).sort({product_title:1}).collation({ locale: "en", caseLevel: true })
 }else if(criteria==='PLtH'){
  sortedProducts = await Product.find({isDeleted:false}).sort({price:1})
 }else if(criteria === 'PHtL'){
  sortedProducts = await Product.find({isDeleted:false}).sort({price:-1})
 }else{
  console.log(criteria);
 }
 res.json({
  success:2,
  sortedProducts:sortedProducts})

  } catch (error) {
    return res.redirect("/errorPage");
  }
}
function errorPage(req, res) {
  return res.render("user/500page");
}

function logout(req, res) {
  try {
    req.session.destroy();
    return res.redirect("/login");
  } catch (error) {
    return res.redirect("/errorPage");
  }
}


module.exports = {
  couponCheck,
  landingPage,
  userSignup,
  postuserSignup,
  postverifyotp,
  login,
  postlogin,
  forgotpassword,
  postforgotpassword,
  getemail,
  postchangepassword,
  productdisplay,
  showitems,
  showcart,
  addToCart,
  changeProductQuantity,
  removeCartItem,
  shop,
  checkout,
  profile,
  showAddress,
  addAddress,
  postAddAddress,
  editAddress,
  postEditAddress,
  removeAddress,
  placeOrder,
  orderSuccess,
  orderFail,
  viewOrders,
  postViewOrders,
  addtoWishlist,
  showWishlist,
  removeFromWishlist,
  loginSecurity,
  postLoginSecurity,
  moveToCart,
  search,
  sort,
  filter,
  errorPage,
  logout,
  cancelOrder,
  orderList
};
