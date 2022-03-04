const Tour=require('./../models/tourModel')
const catchAsync=require('./../utils/catchAsync')
const url=require('url')

exports.getOverview =catchAsync(async (req, res) => {

    //get tour data from collection
    const tours=await Tour.find();
   // console.log(tours);
   
    //build template

    //render
    res.status(200).render('overview', {
        title: `Exciting tours for adventurous people`,
        tours
    })
})

exports.getTour =catchAsync(async (req, res) => {

   const tour=await Tour.findOne({slug:req.params.slug}).populate({
       path:'reviews',
       fields:'review rating user'
   });

    res.status(200).render('tour', {
        title: tour.name,
        tour
    })
});