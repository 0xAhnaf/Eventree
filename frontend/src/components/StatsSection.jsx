function StatsSection() {


const stats = [

{
number:"10,000+",
title:"Happy Customers"
},

{
number:"1000+",
title:"Trusted Vendors"
},

{
number:"25+",
title:"Event Categories"
},

{
number:"100+",
title:"Locations"
}

];


return (

<section className="bg-[#003d2c] px-6 py-16 text-white">


<div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">


{
stats.map((stat)=>(


<div 
key={stat.title}
className="text-center"
>


<h3 className="font-serif text-4xl font-bold text-[#d6b36a]">
{stat.number}
</h3>


<p className="mt-3 text-gray-200">
{stat.title}
</p>


</div>


))
}


</div>


</section>

)


}


export default StatsSection;