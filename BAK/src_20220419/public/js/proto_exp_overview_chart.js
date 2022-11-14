var rtime,region_drag_rtime,noise_drag_rtime;

var timeout = false;
var region_drag_timeout=false;
var noise_drag_timeout=false;
var delta = 311;

var lasttimeofchart=0;

var current_active_noise_region_serial=null;
var current_active_noise_handler=null;
var current_active_noise_signal=null;
function findSignalIdxof(sgname)
{
  if(sgname=="ICP") // ICP를 PLETH로 현재 바꾸기 위해 사용중인 코드 추후 이 두줄 삭제 필요
    sgname="Pleth"; // ICP를 PLETH로 현재 바꾸기 위해 사용중인 코드 추후 이 두줄 삭제 필요

  var rt_idx=0;
  for(i=0;i<raw_signals.length;i++)
  {
    var signal_code=raw_signals[i];

    if(signal_code==sgname)
      rt_idx=i;
  }
  if(rt_idx==-1)
    alert("no data for signal "+sgname);
  return rt_idx;
}
function noisedrag(d){

chart_width=overview_chart_width;
chart_height=overview_chart_height;
margin=overview_chart_margin;

currentX=f_x;


current_active_noise_handler=d3.select(this).attr("id");
var VARR=current_active_noise_handler.split("_");

let selected_time_x=currentX.invert(d3.event.x);

console.log("selected_time_x:"+selected_time_x);
/* let x_idx=bisectB(lineArr[findSignalIdxof(current_active_noise_signal)],selected_time_x.getTime());
thetime=lineArr[findSignalIdxof(current_active_noise_signal)][x_idx].time;
 */

thetime=selected_time_x;

var time_s,time_e;
var is_start=false;
var loc="start";
if(VARR[2]=="s")
  is_start=true;
  
region_width=d3.select("#noise_section").attr("width");
prv_time_s=d3.select("#noise_section").attr("time_s");
prv_time_e=d3.select("#noise_section").attr("time_e");

if(is_start)
{
    loc="start";
    time_s=thetime;
    //time_e=new Date();
    //time_e.setTime(prv_time_e);
    time_e=prv_time_e;
}
else
{
  loc="end";
    //time_s=new Date();
    //time_s.setTime(prv_time_s);
    time_s=prv_time_s;
    time_e=thetime;
}
if(is_start)
  d3.select("#noise_section").attr('x',currentX(time_s));

d3.select("#noise_section").attr('width',currentX(time_e)-currentX(time_s));
d3.select("#noise_section").attr('ori_width',currentX(time_e)-currentX(time_s));

d3.select("#noise_section").attr("time_s",time_s);
d3.select("#noise_section").attr("time_e",time_e);

d3.select("#"+current_active_noise_handler).attr('cx',currentX(thetime));
if(!is_start)
{
  d3.select("#"+current_active_noise_handler.replace("_e","_x")).attr('cx',currentX(thetime)-12);
  d3.select("#"+current_active_noise_handler.replace("_e","_y")).attr('x',currentX(thetime)-12);
}


//해당 구간 데이터 삭제?

  current_active_region_idx=null;
  current_active_handler=null;




  d3.select(this).attr("cx",  d3.event.x);


  clearTimeout(noise_drag_rtime);
  noise_drag_rtime = setTimeout(function(){
    noise_drag_end();
  }, delta);
/* 

  noise_drag_rtime = new Date();
  if (noise_drag_timeout === false) {
      noise_drag_timeout = true;
      noise_drag_end(exp_id,current_active_noise_serial,loc,thetime.getTime());
      console.log("thetime:"+thetime);
  } */

}

function noise_drag_end()
{
    //삭제된 구간의 데이터들
    // 서버에도 모두 강제수정!
}





function addNoiseArea(signal)
{
  chart_width=overview_chart_width;
  chart_height=overview_chart_height;
  margin=overview_chart_margin;

  currentX=f_x;
  if(n_x)
    currentX=n_x;
    

    let time_s=currentX.invert(margin.left+2/5*chart_width);
    let time_e=currentX.invert(margin.left+3/5*chart_width);



  /* 
    let s_idx=bisectB(lineArr[findSignalIdxof(signal)],time_s.getTime());
    let e_idx=bisectB(lineArr[findSignalIdxof(signal)],time_e.getTime());

    time_s=lineArr[findSignalIdxof(signal)][s_idx].time;
    time_e=lineArr[findSignalIdxof(signal)][e_idx].time;
     */


    var svg=d3.select("#chartlist svg");
   var i,circle_cy,rect_y;
 

    var obj={"exp_id":parseInt(exp_id) ,"code":signal,"s_time":time_s.getTime(),"e_time":time_e.getTime() };
    postAPI("/artifacts/",obj,function(data){
          var artifact_serial=data.serial;


          if(signal=="ABP"){
            i=noise_data_ABP.length;
            noise_data_ABP[i]=[artifact_serial,time_s.getTime(),time_e.getTime()];
            rect_y=margin.top;
            circle_cy=margin.top+(chart_height)/2-5;
          }
          else{//ICP
            i=noise_data_ICP.length;
            noise_data_ICP[i]=[artifact_serial,time_s.getTime(),time_e.getTime()];
      
            rect_y=margin.top+chart_height+margin.middle;
            circle_cy=margin.top+chart_height+margin.middle+(chart_height)/2-5;
          }

          

          svg.append("svg:rect") 
          .attr("id", "noise_section_"+signal+artifact_serial)
          .attr("class", "noise_section")
          .attr('x', currentX(time_s) ) 
          .attr('y', rect_y) 
          .attr('width',currentX(time_e)-currentX(time_s)) 
          .attr('height', chart_height)
          .attr('fill', "#696969")
          .attr('fill-opacity', "0.3")
          .attr('stroke-opacity', "1")
          .attr('stroke', "#696969")
          .attr('stroke-width', 2)
          .attr("clip-path", "url(#clip)")
          .attr("time_s",time_s.getTime())
          .attr("time_e",time_e.getTime());
      
      
          svg
          .append("text")
          .attr("id", "noise_handler_"+signal+artifact_serial+"_y")
          .attr("class", "noise_handler noise_handler_"+signal+artifact_serial)
          .attr("y",  rect_y+16)
          .attr("x", currentX(time_e)-12 ) 
          .text("X")
          .attr("font-family", "sans-serif")
          .style("font-weight", "800")
          .attr("font-size", "12px")
          .attr("fill", "#000")
          .attr("text-anchor", "middle");
      
      
          svg.append("svg:circle") 
          .attr("id", "noise_handler_"+signal+artifact_serial+"_x")
          .attr("class", "noise_handler noise_handler_bg noise_handler_"+signal+artifact_serial)
          .attr('cx',currentX(time_e)-12 ) 
          .attr('cy', rect_y+12)
          .attr('r', 10)
          .attr('fill', "#fff")
          .attr('opacity', '0.5')
          .attr("clip-path", "url(#clip)")
          .on("click", function(){
          
            tid=d3.select(this).attr("id");
            RArr=tid.split("_");
            signal=RArr[2].substring(0,3);
            const artifact_serial=RArr[2].substring(3);
            


            
            deleteAPI("/artifacts/?serial="+artifact_serial,{},function(data){
    
              d3.select("#noise_section_"+signal+artifact_serial).remove();
              d3.selectAll(".noise_handler_"+signal+artifact_serial).remove();
                 
        
              
        
              if(signal=="ABP"){
                var signal_idx=-1;
                for(var j=0;j<noise_data_ABP.length;j++)
                {
                  if(artifact_serial==noise_data_ABP[j][0].toString())
                  {
                    signal_idx=j;
                    break;
                  }
                  
                }
                if(signal_idx!=-1)
                  noise_data_ABP.splice(signal_idx,1);
              }
              else{//ICP
                var signal_idx=-1;
                for(var j=0;j<noise_data_ICP.length;j++)
                {
                  if(artifact_serial==noise_data_ICP[j][0].toString())
                  {
                    signal_idx=j;
                    break;
                  }
                  
                }

                if(signal_idx!=-1)
                  noise_data_ICP.splice(signal_idx,1);
              }
            });


            
            
          })
          .on("mousedown.zoom", null)
          .on("touchstart.zoom", null)
          .on("touchmove.zoom", null)
          .on("touchend.zoom", null);
      
            svg.append("svg:circle") 
            .attr("id", "noise_handler_"+signal+artifact_serial+"_s")
            .attr("class", "noise_handler noise_handler_"+signal+artifact_serial)
            .attr('cx', currentX(time_s)) 
            .attr('cy', circle_cy) 
            .attr('r', 10)
            .attr('fill',"#696969")
            .attr('opacity', '1')
            .attr("clip-path", "url(#clip)")
            .call(d3.drag().on("drag", noisedrag))
            .on("mousedown.zoom", null)
            .on("touchstart.zoom", null)
            .on("touchmove.zoom", null)
            .on("touchend.zoom", null);
      
      
            
            svg.append("svg:circle") 
            .attr("id", "noise_handler_"+signal+artifact_serial+"_e")
            .attr("class", "noise_handler noise_handler_"+signal+artifact_serial)
            .attr('cx',currentX(time_e) ) 
            .attr('cy', circle_cy)
            .attr('r', 10)
            .attr('fill', "#696969")
            .attr('opacity', '1')
            .attr("clip-path", "url(#clip)")
            .call(d3.drag().on("drag", noisedrag))
            .on("mousedown.zoom", null)
            .on("touchstart.zoom", null)
            .on("touchmove.zoom", null)
            .on("touchend.zoom", null);


    });


  
  
  


  
  //현 차트 가운데 지점에 가상의 region 추가
  //Analyze 숨기기
}


var current_active_region_idx=null;
var current_active_handler=null;
var n_x,f_x,bisectA,bisectB;
var     ArrTimeMerged;

function drag(d){

  currentX=f_x;
  if(n_x)
    currentX=n_x;

  current_active_handler=d3.select(this).attr("id");
  var VARR=current_active_handler.split("_");
  current_active_region_idx=VARR[2];



  let selected_time_x=currentX.invert(d3.event.x);
  console.log("selected_time_x:"+selected_time_x);
  console.log("current_active_region_idx"+current_active_region_idx);
  //constraint check
  for(var i=0;i<3;i++)
  {

    if(current_active_region_idx==i.toString())
    {
      
      if(VARR[3]=="s")
      {
        var min=overview_chart_margin.left;
        if(i>0)
            min=parseInt(d3.select("#region_handler_"+(i-1).toString()+"_e").attr("cx"));
        if(d3.event.x<min)
        {
          return;
        }
        
        if(d3.event.x>parseInt(d3.select("#region_handler_"+i.toString()+"_e").attr("cx")))
        {
          return;
        }
  
      }
      else//e
      {
        var max=overview_chart_margin.left+overview_chart_width;
        if(i<2)
          max=parseInt(d3.select("#region_handler_"+(i+1).toString()+"_s").attr("cx"));
        if(d3.event.x>max)
        {
          return;
        }
        if(d3.event.x<parseInt(d3.select("#region_handler_"+(i).toString()+"_s").attr("cx")))
        {
          return;
        }
      }

    }
  }



  if(n_x)
    selected_time_x=n_x.invert(d3.event.x);
//  let x_idx=bisectA(ArrTimeMerged,selected_time_x);
//  thetime=ArrTimeMerged[x_idx];
  thetime=selected_time_x;
  
    //region에 시간 조정해둘것
  var time_s,time_e;
  var is_start=false;
  
  if(VARR[3]=="s")
      is_start=true;

 region_width=d3.select("#section"+current_active_region_idx).attr("width");
 prv_time_s=d3.select("#section"+current_active_region_idx).attr("time_s");
 prv_time_e=d3.select("#section"+current_active_region_idx).attr("time_e");
 var loc="start";
 if(is_start)
  {
    time_s=thetime;
    time_e=new Date();
    time_e.setTime(prv_time_e);
    loc="start";
  }
  else
  {
    time_s=new Date();
    time_s.setTime(prv_time_s);
    time_e=thetime;
    loc="end";
  }
  console.log(time_s)
 console.log(time_e)

  if(!annotation_regions[current_active_region_idx])
    annotation_regions[current_active_region_idx]=[];

  annotation_regions[current_active_region_idx].s=time_s;
  annotation_regions[current_active_region_idx].e=time_e;

  d3.select("#section"+current_active_region_idx).attr('x',currentX(time_s));
  d3.select("#section"+current_active_region_idx).attr('width',currentX(time_e)-currentX(time_s));

  d3.select("#section"+current_active_region_idx).attr("time_s",time_s.getTime());
  d3.select("#section"+current_active_region_idx).attr("time_e",time_e.getTime());
  d3.select("#"+current_active_handler).attr('cx',currentX(thetime));
 
  var theregion="baseline";
  if(current_active_region_idx=="1")
    theregion="transient";
  if(current_active_region_idx=="2")
    theregion="plateau";
  current_active_region_idx=null;
  current_active_handler=null;

  d3.select(this).attr("cx",  d3.event.x);


  clearTimeout(region_drag_rtime);
  region_drag_rtime = setTimeout(function(){
    region_drag_end(exp_id,theregion,loc,thetime);
  }, delta);
/*   region_drag_rtime = new Date();
  if (region_drag_timeout === false) {
      region_drag_timeout = true;
      region_drag_end(exp_id,theregion,loc,thetime);
  } */

}
function region_drag_end(exp_id,theregion,loc,thetime){

  
  /* 
  if (new Date() - region_drag_rtime < delta) {
    setTimeout(function (){ region_drag_end(exp_id,theregion,loc,thetime);}, delta);
  } else {
      region_drag_timeout = false; */
      obj={"kind":theregion,"loc":loc,"new_value":thetime.getTime()};
      patchAPI("/experiments/"+exp_id+"/region",obj,function(data){  });
/*   } */

}
var overview_chart_width;
var overview_chart_height;
var overview_chart_margin;

function drawOverviewChart(parentId,h,data_PPG,data_X,data_Y,data_Z,data_ACTIVITY,data_LF,data_HF,data_NNI,data_trigger,data_event) {
//,noise_data_ICP,noise_data_ABP
    w=$("#"+parentId).width();
    d3.select("#"+parentId).selectAll("*").remove();
  
    let array1= data_PPG.map(x => x.time);
    

    //ArrTimeMerged = [...new Set([...array1,...array2])];

    var margin = {top: 20, right: 10, bottom: 40, left: 100, middle:20};
    var chart_width = w - margin.left - margin.right;
    var chart_height = (h - margin.top - margin.bottom-margin.middle*4)/8;

    overview_chart_margin=margin;
    overview_chart_width=chart_width;
    overview_chart_height=chart_height;

    var extent = [
      [margin.left,margin.top], 
      [margin.left+chart_width, h-margin.bottom]
    ];

  
    const svg = d3.select("#"+parentId).append("svg")
    .attr("width", "100%")
    .attr("height", h)
    .attr("viewBox", "0 0 "+w+" "+h)
    .attr("preserveAspectRatio", "none")
    //.style("background-color","white")
    //.attr("fill","white")
    //.call(zoom);



    svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .attr("width", chart_width )
    .attr("height", h);
       
  //  .attr("transform",  "translate(" + margin.left + "," + margin.top + ")");
  

  var parseTime = d3.timeParse("%d-%b-%y");
  //f_x = d3.scaleTime().range([margin.left, chart_width+margin.left]);
  f_x = d3.scaleLinear().range([margin.left, chart_width+margin.left]);

  var Y1,Y2,Y3,Y4,Y5_1,Y5_2,Y5_3,Y6,Y7,Y8;
  
  Y1 = d3.scaleLinear().range([margin.top+chart_height, margin.top]);
  Y2 = d3.scaleLinear().range([margin.top+chart_height*2+margin.middle*(2-1), margin.top+(chart_height+margin.middle)*(2-1)]);
  Y3 = d3.scaleLinear().range([margin.top+chart_height*3+margin.middle*(3-1), margin.top+(chart_height+margin.middle)*(3-1)]);
  Y4 = d3.scaleLinear().range([margin.top+chart_height*4+margin.middle*(4-1), margin.top+(chart_height+margin.middle)*(4-1)]);

  Y5_1 = d3.scaleLinear().range([margin.top+(chart_height+margin.middle)*(5-1)+chart_height*1/3, margin.top+(chart_height+margin.middle)*(5-1)]);
  Y5_2 = d3.scaleLinear().range([margin.top+(chart_height+margin.middle)*(5-1)+chart_height*2/3, margin.top+(chart_height+margin.middle)*(5-1)+chart_height*1/3]);
  Y5_3 = d3.scaleLinear().range([margin.top+(chart_height+margin.middle)*(5-1)+chart_height*3/3, margin.top+(chart_height+margin.middle)*(5-1)+chart_height*2/3]);

  Y6 = d3.scaleLinear().range([margin.top+chart_height*6+margin.middle*(6-1), margin.top+(chart_height+margin.middle)*(6-1)]);
  Y7 = d3.scaleLinear().range([margin.top+chart_height*7+margin.middle*(7-1), margin.top+(chart_height+margin.middle)*(7-1)]);
  Y8 = d3.scaleLinear().range([margin.top+chart_height*8+margin.middle*(8-1), margin.top+(chart_height+margin.middle)*(8-1)]);

  

  f_x.domain([d3.min(array1),d3.max(array1)]);  

    Y1.domain([d3.min(data_PPG,function(c) { return c.x}),d3.max(data_PPG,function(c) { return c.x})]);
    Y2.domain([d3.min(data_X,function(c) { return c.x}),d3.max(data_X,function(c) { return c.x})]);
    Y3.domain([d3.min(data_Y,function(c) { return c.x}),d3.max(data_Y,function(c) { return c.x})]);
    Y4.domain([d3.min(data_Z,function(c) { return c.x}),d3.max(data_Z,function(c) { return c.x})]);
  
    Y5_1.domain([0,100]);
    Y5_2.domain([0,100]);
    Y5_3.domain([0,100]);
/* 
    Y5_1.domain([d3.min(data_ACTIVITY,function(c) { return c.intensity}),d3.max(data_ACTIVITY,function(c) { return c.intensity})]);
    Y5_2.domain([d3.min(data_ACTIVITY,function(c) { return c.height}),d3.max(data_ACTIVITY,function(c) { return c.height})]);
    Y5_3.domain([d3.min(data_ACTIVITY,function(c) { return c.interval}),d3.max(data_ACTIVITY,function(c) { return c.interval})]); */
  
    Y6.domain([d3.min(data_LF,function(c) { return c.x}),d3.max(data_LF,function(c) { return c.x})]);
    Y7.domain([d3.min(data_HF,function(c) { return c.x}),d3.max(data_HF,function(c) { return c.x})]);
    Y8.domain([d3.min(data_NNI,function(c) { return c.x}),d3.max(data_NNI,function(c) { return c.x})]);
  


    let linecolor=["blue","#d031d4","#7ad669"];
  
  
  // gridlines in x axis function
  function make_x_gridlines() {		
  return d3.axisBottom(f_x)
    .ticks(10)
  }
  
  // gridlines in y axis function
  function make_y1_gridlines() {		
  return d3.axisLeft(Y1)
    .ticks(5)
  }
  function make_y2_gridlines() {		
    return d3.axisLeft(Y2)
      .ticks(5)
    }  
function make_y3_gridlines() {		
    return d3.axisLeft(Y3)
        .ticks(5)
}  

function make_y4_gridlines() {		
    return d3.axisLeft(Y4)
        .ticks(5)
}  
/* 
function make_y51_gridlines() {		
  return d3.axisLeft(Y5_1)
  .ticks(2).tickSizeOuter(0).tickSizeInner(0);
}  

function make_y52_gridlines() {		
  return d3.axisLeft(Y5_2)
  .ticks(2).tickSizeOuter(0).tickSizeInner(0);
}  

function make_y53_gridlines() {		
  return d3.axisLeft(Y5_3)
      .ticks(2).tickSizeOuter(0).tickSizeInner(0);
}   */

function make_y6_gridlines() {		
  return d3.axisLeft(Y6)
      .ticks(5)
}  


function make_y7_gridlines() {		
  return d3.axisLeft(Y7)
      .ticks(5)
}  


function make_y8_gridlines() {		
  return d3.axisLeft(Y8)
      .ticks(5)
}  



            
  // add the X gridlines
  svg.append("g")			
  .attr("class", "grid x-guideline")
  .attr("transform", "translate(0," + (chart_height*5+margin.middle*4+margin.top) + ")")
  .call(make_x_gridlines()
  .tickSize(-chart_height*2-margin.middle)
  .tickFormat("")
  )
  
  // add the Y gridlines
  
  svg.append("g")			
  .attr("class", "grid Y1")
  .attr("transform", "translate("+margin.left+",0)")
  .call(make_y1_gridlines()
  .tickSize(-chart_width)
  .tickFormat("")
  )

  svg.append("g")			
  .attr("class", "grid Y2")
  .attr("transform", "translate("+margin.left+",0)")
  .call(make_y2_gridlines()
  .tickSize(-chart_width)
  .tickFormat("")
  )

  
  svg.append("g")			
  .attr("class", "grid Y3")
  .attr("transform", "translate("+margin.left+",0)")
  .call(make_y3_gridlines()
  .tickSize(-chart_width)
  .tickFormat("")
  )


  
  svg.append("g")			
  .attr("class", "grid Y4")
  .attr("transform", "translate("+margin.left+",0)")
  .call(make_y4_gridlines()
  .tickSize(-chart_width)
  .tickFormat("")
  )

  /* 
  svg.append("g")			
  .attr("class", "grid Y51")
  .attr("transform", "translate("+margin.left+",0)")
  .call(make_y51_gridlines()
  
  )
   
  svg.append("g")			
  .attr("class", "grid Y52")
  .attr("transform", "translate("+margin.left+",0)")
  .call(make_y52_gridlines()
  
  )
   
  svg.append("g")			
  .attr("class", "grid Y53")
  .attr("transform", "translate("+margin.left+",0)")
  .call(make_y53_gridlines()
  
  )  */
  svg.append("g")			
  .attr("class", "grid Y6")
  .attr("transform", "translate("+margin.left+",0)")
  .call(make_y6_gridlines()
  .tickSize(-chart_width)
  .tickFormat("")
  )
  svg.append("g")			
  .attr("class", "grid Y7")
  .attr("transform", "translate("+margin.left+",0)")
  .call(make_y7_gridlines()
  .tickSize(-chart_width)
  .tickFormat("")
  )
  svg.append("g")			
  .attr("class", "grid Y8")
  .attr("transform", "translate("+margin.left+",0)")
  .call(make_y8_gridlines()
  .tickSize(-chart_width)
  .tickFormat("")
  )

  
  svg.append("line")
  .attr("class","grid")
  .attr("x1",margin.left)
  .attr("x2",margin.left+chart_width)
  .attr("y1", margin.top+(chart_height+margin.middle)*(5-1))
  .attr("y2", margin.top+(chart_height+margin.middle)*(5-1))
  .attr("stroke", "#fff")
  .attr("stroke-width", 1);


  svg.append("line")
  .attr("class","grid")
  .attr("x1",margin.left)
  .attr("x2",margin.left+chart_width)
  .attr("y1", margin.top+(chart_height+margin.middle)*(5-1)+(chart_height*1/3))
  .attr("y2", margin.top+(chart_height+margin.middle)*(5-1)+(chart_height*1/3))
  .attr("stroke", "#fff")
  .attr("stroke-width", 1);

  svg.append("line")
  .attr("class","grid")
  .attr("x1",margin.left)
  .attr("x2",margin.left+chart_width)
  .attr("y1", margin.top+(chart_height+margin.middle)*(5-1)+(chart_height*2/3))
  .attr("y2", margin.top+(chart_height+margin.middle)*(5-1)+(chart_height*2/3))
  .attr("stroke", "#fff")
  .attr("stroke-width", 1);

  svg.append("line")
  .attr("class","grid")
  .attr("x1",margin.left)
  .attr("x2",margin.left+chart_width)
  .attr("y1", margin.top+(chart_height+margin.middle)*(5-1)+(chart_height*3/3))
  .attr("y2", margin.top+(chart_height+margin.middle)*(5-1)+(chart_height*3/3))
  .attr("stroke", "#fff")
  .attr("stroke-width", 1);



  var xAxis=d3.axisBottom(f_x).ticks(10).tickFormat(d3.format(".2s"));
  
  for(var i=0;i<8;i++)
  {
   /*  svg.append("g")
    .attr("class", "axis x-axis-"+i)
    .attr("transform", "translate(0," + (margin.top+chart_height*(i+1)+margin.middle*(i)) + ")")
   .call(xAxis.tickFormat(d3.timeFormat("%H:%M:%S")))
     
    .selectAll("text")	
    .style("text-anchor", "middle");

*/
   
  }
 

    svg
    .append("text")
    .attr("y", margin.top+(chart_height+margin.middle)*(1-1)+(margin.middle/3))
    .attr("x", 30)
    .attr("class", "chart_title_on_svg")
    
    .text("PPG")
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .attr("text-anchor", "middle");
    
    svg
    .append("text")
    .attr("y", margin.top+(chart_height+margin.middle)*(2-1)+(margin.middle/3))
    .attr("x", 30)
    .attr("class", "chart_title_on_svg")
    .text("X")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("font-size", "15px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");

  
    svg
    .append("text")
    .attr("y", margin.top+(chart_height+margin.middle)*(3-1)+(margin.middle/3))
    .attr("x", 30)
    .attr("class", "chart_title_on_svg")
    .text("Y")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("font-size", "15px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");



    svg
    .append("text")
    .attr("y", margin.top+(chart_height+margin.middle)*(4-1)+(margin.middle/3))
    .attr("x", 30)
    .attr("class", "chart_title_on_svg")
    .text("Z")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("font-size", "15px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");

    svg
    .append("text")
    .attr("y", margin.top+(chart_height+margin.middle)*(5-1)+(margin.middle/3))
    .attr("x", 30)
    .attr("class", "chart_title_on_svg")
    .text("Stimulus")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("font-size", "15px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");


    svg
    .append("text")
    .attr("y", margin.top+(chart_height+margin.middle)*(5-1)+chart_height*1/6+(margin.middle/3))
    .attr("x", 60)
    .attr("class", "chart_title_on_svg")
    .text("Intensity")
    .attr("font-family", "sans-serif")
    
    .attr("font-size", "11px")
    .attr("fill", "black")
    .attr("text-anchor", "end");

    svg
    .append("text")
    .attr("y", margin.top+(chart_height+margin.middle)*(5-1)+chart_height*3/6+(margin.middle/3))
    .attr("x", 60)
    .attr("class", "chart_title_on_svg")
    .text("Height")
    .attr("font-family", "sans-serif")
    
    .attr("font-size", "11px")
    .attr("fill", "black")
    .attr("text-anchor", "end");

    svg
    .append("text")
    .attr("y", margin.top+(chart_height+margin.middle)*(5-1)+chart_height*5/6+(margin.middle/3))
    .attr("x", 60)
    .attr("class", "chart_title_on_svg")
    .text("Interval")
    .attr("font-family", "sans-serif")
    
    .attr("font-size", "11px")
    .attr("fill", "black")
    .attr("text-anchor", "end");

    svg
    .append("text")
    .attr("y", margin.top+(chart_height+margin.middle)*(6-1)+(margin.middle/3))
    .attr("x", 30)
    .attr("class", "chart_title_on_svg")
    .text("LF")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("font-size", "15px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");

    svg
    .append("text")
    .attr("y", margin.top+(chart_height+margin.middle)*(7-1)+(margin.middle/3))
    .attr("x", 30)
    .attr("class", "chart_title_on_svg")
    .text("HF")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("font-size", "15px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");

    svg
    .append("text")
    .attr("y", margin.top+(chart_height+margin.middle)*(8-1)+(margin.middle/3))
    .attr("x", 30)
    .attr("class", "chart_title_on_svg")
    .text("NNI")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("font-size", "15px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");



  var y1Axis,y2Axis,y3Axis,y4Axis,y51Axis,y52Axis,y53Axis,y6Axis,y7Axis,y8Axis;
  y1Axis = d3.axisLeft().scale(Y1).ticks(5);
  y2Axis = d3.axisLeft().scale(Y2).ticks(5);
  y3Axis = d3.axisLeft().scale(Y3).ticks(5);
  y4Axis = d3.axisLeft().scale(Y4).ticks(5);
  y51Axis = d3.axisLeft().ticks(2).tickSizeOuter(0).tickSizeInner(0).scale(Y5_1);
  y52Axis = d3.axisLeft().ticks(2).tickSizeOuter(0).tickSizeInner(0).scale(Y5_2);
  y53Axis = d3.axisLeft().ticks(2).tickSizeOuter(0).tickSizeInner(0).scale(Y5_3);
  y6Axis = d3.axisLeft().scale(Y6).ticks(5);
  y7Axis = d3.axisLeft().scale(Y7).ticks(5);
  y8Axis = d3.axisLeft().scale(Y8).ticks(5);
  
  svg.append("g")
  .attr("class", "axis y-axis-1")
  .attr("transform", "translate("+margin.left+",0)")
  .call(y1Axis);

  svg.append("g")
  .attr("class", "axis y-axis-2")
  .attr("transform", "translate("+margin.left+",0)")
  .call(y2Axis);


  svg.append("g")
  .attr("class", "axis y-axis-3")
  .attr("transform", "translate("+margin.left+",0)")
  .call(y3Axis);

  
  svg.append("g")
  .attr("class", "axis y-axis-4")
  .attr("transform", "translate("+margin.left+",0)")
  .call(y4Axis);

  
  svg.append("g")
  .attr("class", "axis y-axis-5")
  .attr("transform", "translate("+margin.left+",0)")
  .call(y51Axis);

  svg.append("g")
  .attr("class", "axis y-axis-5")
  .attr("transform", "translate("+margin.left+",0)")
  .call(y52Axis);


  svg.append("g")
  .attr("class", "axis y-axis-5")
  .attr("transform", "translate("+margin.left+",0)")
  .call(y53Axis);


  

  svg.append("g")
  .attr("class", "axis y-axis-6")
  .attr("transform", "translate("+margin.left+",0)")
  .call(y6Axis);


  svg.append("g")
  .attr("class", "axis y-axis-7")
  .attr("transform", "translate("+margin.left+",0)")
  .call(y7Axis);


  svg.append("g")
  .attr("class", "axis y-axis-8")
  .attr("transform", "translate("+margin.left+",0)")
  .call(y8Axis);



  var valueline1 = d3.line()
.x(function(d) { return f_x(d.time); })
.y(function(d) { return Y1(d.x); });

var valueline2 = d3.line()
.x(function(d) { return f_x(d.time); })
.y(function(d) { return Y2(d.x); });


var valueline3 = d3.line()
.x(function(d) { return f_x(d.time); })
.y(function(d) { return Y3(d.x); });


var valueline4 = d3.line()
.x(function(d) { return f_x(d.time); })
.y(function(d) { return Y4(d.x); });

var valueline5_1 = d3.line()
.x(function(d) { return f_x(d.time); })
.y(function(d) { return Y5_1(d.intensity); })
.curve(d3.curveStepBefore);

var valueline5_2 = d3.line()
.x(function(d) { return f_x(d.time); })
.y(function(d) { return Y5_2(d.height); })
.curve(d3.curveStepBefore);

var valueline5_3 = d3.line()
.x(function(d) { return f_x(d.time); })
.y(function(d) { return Y5_3(d.interval); })
.curve(d3.curveStepBefore);


var valueline6 = d3.line()
.x(function(d) { return f_x(d.time); })
.y(function(d) { return Y6(d.x); });

var valueline7 = d3.line()
.x(function(d) { return f_x(d.time); })
.y(function(d) { return Y7(d.x); });

var valueline8 = d3.line()
.x(function(d) { return f_x(d.time); })
.y(function(d) { return Y8(d.x); });


var stroke_width=1.5;
  
      svg.append("path")
      .datum(data_PPG)
      .attr("class","chart1_path")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", stroke_width)
      .attr("clip-path", "url(#clip)")
      .attr("d", valueline1);

      svg.append("path")
      .datum(data_X)
      .attr("class","chart2_path")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", stroke_width)
      .attr("clip-path", "url(#clip)")
      .attr("d", valueline2);


      svg.append("path")
      .datum(data_Y)
      .attr("class","chart2_path")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", stroke_width)
      .attr("clip-path", "url(#clip)")
      .attr("d", valueline3);


      svg.append("path")
      .datum(data_Z)
      .attr("class","chart2_path")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", stroke_width)
      .attr("clip-path", "url(#clip)")
      .attr("d", valueline4);


      svg.append("path")
      .datum(data_ACTIVITY)
      .attr("class","chart2_path")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", stroke_width)
      .attr("clip-path", "url(#clip)")
      .attr("d", valueline5_1);

      svg.append("path")
      .datum(data_ACTIVITY)
      .attr("class","chart2_path")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", stroke_width)
      .attr("clip-path", "url(#clip)")
      .attr("d", valueline5_2);

      svg.append("path")
      .datum(data_ACTIVITY)
      .attr("class","chart2_path")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", stroke_width)
      .attr("clip-path", "url(#clip)")
      .attr("d", valueline5_3);



      
      svg.append("path")
      .datum(data_LF)
      .attr("class","chart2_path")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", stroke_width)
      .attr("clip-path", "url(#clip)")
      .attr("d", valueline6);
      
      svg.append("path")
      .datum(data_HF)
      .attr("class","chart2_path")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", stroke_width)
      .attr("clip-path", "url(#clip)")
      .attr("d", valueline7);
      
      svg.append("path")
      .datum(data_NNI)
      .attr("class","chart2_path")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", stroke_width)
      .attr("clip-path", "url(#clip)")
      .attr("d", valueline8);

      bisectA=d3.bisector(function(d) { 
        return  d;
      }).left;

      bisectB=d3.bisector(function(d) { 
        return d.time;
      }).left;

      console.log("------------regions------");
//      console.log(annotation_regions);



















let time_s=f_x.invert(margin.left+2/5*chart_width);
let time_e=f_x.invert(margin.left+3/5*chart_width);



var rect_y=margin.top;
var circle_cy=margin.top+chart_height*2+margin.middle*2+(chart_height)/2-5;
console.log(data_trigger);
console.log(data_PPG);

for(var i=0;i<data_trigger.length;i++)
{

  svg.append("svg:rect") 
  .attr("id", "trigger_"+data_trigger[i].serial)
  .attr("class", "trigger")
  .attr('x', f_x(data_trigger[i].time)) 
  .attr('y', rect_y) 
  .attr('width',"3px") 
  .attr('height', chart_height)
  .attr('fill', "#FFCD05")
  .attr("clip-path", "url(#clip)")

}

for(var i=0;i<data_event.length;i++)
{
  svg.append("circle") 
  .attr("id", "trigger_"+data_event[i].serial)
  .attr("class", "trigger")
  .attr('cx', f_x(data_event[i].time)) 
  .attr('cy', margin.top+10) 
  .attr('r',10) 
  .attr('fill', "#FFCD05")
  .attr("clip-path", "url(#clip)")
  .datum(data_event[i])
  .on('click', function(d,idx) {
    // handle events here
    // d - datum
    // i - identifier or index
    // this - the `<rect>` that was clicked
    
    var time_milli_sec=d.time*4;
    var time_min=parseInt(time_milli_sec/(60*1000));
    var time_sec=parseInt(time_milli_sec /1000)-time_min*60;
    
    var time_min_txt=time_min<10?"0"+time_min:time_min;
    var time_sec_txt=time_sec<10?"0"+time_sec:time_sec;

    showEventMarker(time_min_txt+":"+time_sec_txt,d.memo,d.serial);
    

});
}


svg.append("svg:rect") 
.attr("id", "noise_section")
.attr("class", "noise_handler")
.attr('x', f_x(time_s) ) 
.attr('y', rect_y) 
.attr('width',1) 
.attr('height', chart_height*5+margin.middle*4)
.attr('fill', "#696969")
.attr('fill-opacity', "0.3")
.attr('stroke-opacity', "1")
.attr('stroke', "#696969")
.attr('stroke-width', 2)
.attr('opacity', "0")
.attr("clip-path", "url(#clip)")
.attr("time_s",time_s)
.attr("time_e",time_e)
.attr("ori_width",f_x(time_e)-f_x(time_s));
//.attr("time_s",time_s.getTime())
//.attr("time_e",time_e.getTime());


svg
.append("text")
.attr("id", "noise_handler_y")
.attr("class", "noise_handler")
.attr("y",  rect_y+16)
.attr("x", f_x(time_e)-12 ) 
.text("X")
.attr("font-family", "sans-serif")
.style("font-weight", "800")
.attr("font-size", "12px")
.attr("fill", "#000")
.attr('opacity', "0")
.attr("text-anchor", "middle");


svg.append("svg:circle") 
.attr("id", "noise_handler_x")
.attr("class", "noise_handler noise_handler_bg noise_handler")
.attr('cx',f_x(time_e)-12 ) 
.attr('cy', rect_y+12)
.attr('r', 10)
.attr('fill', "#fff")
.attr('opacity', '0')
.attr("clip-path", "url(#clip)")
.on("click", function(){

  var tid=d3.select(this).attr("id");
  endDeleteRegion();
})
.on("mousedown.zoom", null)
.on("touchstart.zoom", null)
.on("touchmove.zoom", null)
.on("touchend.zoom", null);

  svg.append("svg:circle") 
  .attr("id", "noise_handler_s")
  .attr("class", "noise_handler")
  .attr('cx', f_x(time_s)) 
  .attr('cy', circle_cy) 
  .attr('r', 10)
  .attr('fill',"#696969")
  .attr('opacity', '0')
  .attr("clip-path", "url(#clip)")
  .call(d3.drag().on("drag", noisedrag))
  .on("mousedown.zoom", null)
  .on("touchstart.zoom", null)
  .on("touchmove.zoom", null)
  .on("touchend.zoom", null);


  
  svg.append("svg:circle") 
  .attr("id", "noise_handler_e")
  .attr("class", "noise_handler")
  .attr('cx',f_x(time_e) ) 
  .attr('cy', circle_cy)
  .attr('r', 10)
  .attr('fill', "#696969")
  .attr('opacity', '0')
  .attr("clip-path", "url(#clip)")
  .call(d3.drag().on("drag", noisedrag))
  .on("mousedown.zoom", null)
  .on("touchstart.zoom", null)
  .on("touchmove.zoom", null)
  .on("touchend.zoom", null);




/*   
      for(i=0;i<noise_data_ABP.length;i++)
      {
        time_s_date=new Date();
        time_s_date.setTime(noise_data_ABP[i][1]);
        time_e_date=new Date();
        time_e_date.setTime(noise_data_ABP[i][2]);
        addNoiseAreaWithTime(noise_data_ABP[i][0],"ABP",time_s_date,time_e_date);
      }
  
      for(i=0;i<noise_data_ICP.length;i++)
      {
        time_s_date=new Date();
        time_s_date.setTime(noise_data_ICP[i][1]);
        time_e_date=new Date();
        time_e_date.setTime(noise_data_ICP[i][2]);
        addNoiseAreaWithTime(noise_data_ICP[i][0],"ICP",time_s_date,time_e_date);
      }

    

//memo
for(var i=0;i<lineArr[0].length;i++)
{
  if(lineArr[0][i].m)
  {

    cur_data_idx_for_memo=0;
    cur_time_idx_for_memo=i;
    t_memo_time=lineArr[0][i].time;


    svg.append("svg:rect") 
    .attr("id","memo_"+cur_data_idx_for_memo+"_"+cur_time_idx_for_memo)
    .attr("class", "memo")
    .attr('x', f_x(t_memo_time)-7) 
    .attr('y', 30) 
    .attr('width',14) 
    .attr('height', 14)
    .attr('fill', "gray")
    .attr("clip-path", "url(#clip)")
    .datum(t_memo_time.getTime())
    .on("click", function(){
     
      tid=d3.select(this).attr("id");
      var RARR=tid.split("_");

      t_cur_data_idx_for_memo=RARR[1];
      t_cur_time_idx_for_memo=RARR[2];
        showMemoPopup(t_cur_data_idx_for_memo,t_cur_time_idx_for_memo);
    });
  }
}
 */



          

  }


  function zoomedend(parentId,data_ABP_idx,data_ICP_idx,h,margin,chart_width) {
  


  let start_time_x=n_x.invert(margin.left);
  let end_time_x=n_x.invert(margin.left+chart_width);

  if (new Date() - rtime < delta) {
      setTimeout(function (){ zoomedend(parentId,data_ABP_idx,data_ICP_idx,h,margin,chart_width);}, delta);
  } else {
      timeout = false;

      skip_v=125*(end_time_x.getTime()-start_time_x.getTime())/8000000;
      if(skip_v<1)
       skip_v=1;

       skip_v=parseInt(skip_v);
       console.log("skip_v:"+skip_v);

      getAPI2("/signals/"+exp_id+"?time_s="+start_time_x.getTime()+"&time_e="+(end_time_x.getTime())+"&skip_v="+skip_v,{},"GET",function(data){

        data_ABP=[];
        data_ICP=[];
        ABP_cnt=0;
        ICP_cnt=0;

        for(var i=0;i<data.length;i++)
        {
            R=data[i];

            xtime=new Date();
            xtime.setTime(R.time);

            var lineData={};
            lineData["time"]=xtime;
            lineData["x"]=parseFloat(R.v);
            lineData["m"]=R.memo;


            if(R.code=="ABP")
            {
              data_ABP[ABP_cnt++]=lineData;
            }
            else if(R.code=="ICP"||R.code=="Pleth")
            {
              data_ICP[ICP_cnt++]=lineData;
            }

        }
    let array1= data_ABP.map(x => x.x);
      let array2= data_ICP.map(x => x.x);
  
    ArrTimeMerged = [...new Set([...array1,...array2])];
        
      
       // annotation_regions=[];

       // noise_data_ABP=[];
        //noise_data_ICP=[];


        
         //regions=[null,null,null];
            

              
              var chart_height = (h - margin.top - margin.bottom-margin.middle)/2;
        
          
              const svg = d3.select("#"+parentId+" svg");
              

                          
              var Y1,Y2;
              
              Y1 = d3.scaleLinear().range([margin.top+chart_height, margin.top]);
              Y2 = d3.scaleLinear().range([margin.top+chart_height*2+margin.middle*(2-1), margin.top+(chart_height+margin.middle)*(2-1)]);


              
                Y1.domain([d3.min(data_ABP,function(c) { return c.x}),d3.max(data_ABP,function(c) { return c.x})]);
                Y2.domain([d3.min(data_ICP,function(c) { return c.x}),d3.max(data_ICP,function(c) { return c.x})]);
                


/* 
              n_y = d3.scaleLinear().range([margin.top+chart_height1, margin.top]);
              n_y.domain([d3.min(data,function(c) { return c.low_price}),d3.max(data,function(c) { return c.high_price})]);
              Y1=n_y;
              
              var yAxis_n = d3.axisRight().scale(n_y);
              svg.select(".y-axis-1").call(yAxis_n);     

                      svg.select(".bar_group").remove();              
                      svg.select(".sub_group").remove();              


                */
                      svg.selectAll(".chart1_path").remove();              
                      svg.selectAll(".chart2_path").remove(); 
                      
                      valueline1 = d3.line()
                      .x(function(d) { return n_x(new Date(d.time)); })
                      .y(function(d) { return Y1(d.x); });
                      
                      valueline2 = d3.line()
                      .x(function(d) { return n_x(new Date(d.time)); })
                      .y(function(d) { return Y2(d.x); });
                  
                  

        

                      var stroke_width=1.5;
  
                      svg.append("path")
                      .datum(data_ABP)
                      .attr("class","chart1_path")
                      .attr("fill", "none")
                      .attr("stroke", "#000")
                      .attr("stroke-linejoin", "round")
                      .attr("stroke-linecap", "round")
                      .attr("stroke-width", stroke_width)
                      .attr("clip-path", "url(#clip)")
                      .attr("d", valueline1);
                
                      svg.append("path")
                      .datum(data_ICP)
                      .attr("class","chart2_path")
                      .attr("fill", "none")
                      .attr("stroke", "#000")
                      .attr("stroke-linejoin", "round")
                      .attr("stroke-linecap", "round")
                      .attr("stroke-width", stroke_width)
                      .attr("clip-path", "url(#clip)")
                      .attr("d", valueline2);
                
                  
                      for(var i=0;i<3;i++)
                      {
                        time_s=svg.select("#section"+i).attr("time_s");
                        time_e=svg.select("#section"+i).attr("time_e");
                  
                        time_s_date=new Date();
                        time_s_date.setTime(time_s);
                        time_e_date=new Date();
                        time_e_date.setTime(time_e);
                  
                        svg.select("#section"+i)
                        .attr("x",n_x(time_s_date))
                        .attr("width",n_x(time_e_date)-n_x(time_s_date));
                  
                        svg.select("#region_handler_"+i+"_s")
                        .attr("cx",n_x(time_s_date));
                  
                        svg.select("#region_handler_"+i+"_e")
                        .attr("cx",n_x(time_e_date));
                        

                      }
                  

                      for(var j=0;j<noise_data_ABP.length;j++)
                      {
                        var signal="ABP";
                        var serial=noise_data_ABP[j][0];
                        var time_s=new Date();
                        time_s.setTime(noise_data_ABP[j][1]);
                        var time_e=new Date();
                        time_e.setTime(noise_data_ABP[j][2]);
                        
                        d3.select("#noise_section_"+signal+serial).attr('x',n_x(time_s));
                        d3.select("#noise_section_"+signal+serial).attr('width',n_x(time_e)-n_x(time_s));
                        d3.select("#noise_handler_"+signal+serial+"_x").attr('cx',n_x(time_e)-12);
                        d3.select("#noise_handler_"+signal+serial+"_y").attr('x',n_x(time_e)-12);
    
                        d3.select("#noise_handler_"+signal+serial+"_s").attr('cx',n_x(time_s));
                        d3.select("#noise_handler_"+signal+serial+"_e").attr('cx',n_x(time_e));                        
                      }
                    

                      for(var j=0;j<noise_data_ICP.length;j++)
                      {
                        var signal="ICP";
                        var serial=noise_data_ICP[j][0];
                        var time_s=new Date();
                        time_s.setTime(noise_data_ICP[j][1]);
                        var time_e=new Date();
                        time_e.setTime(noise_data_ICP[j][2]);
                        
                        d3.select("#noise_section_"+signal+serial).attr('x',n_x(time_s));
                        d3.select("#noise_section_"+signal+serial).attr('width',n_x(time_e)-n_x(time_s));
                        d3.select("#noise_handler_"+signal+serial+"_x").attr('cx',n_x(time_e)-12);
                        d3.select("#noise_handler_"+signal+serial+"_y").attr('x',n_x(time_e)-12);
    
                        d3.select("#noise_handler_"+signal+serial+"_s").attr('cx',n_x(time_s));
                        d3.select("#noise_handler_"+signal+serial+"_e").attr('cx',n_x(time_e));                        
                      }
                    
                    


            
              
          
          });




  }               
}



    
  