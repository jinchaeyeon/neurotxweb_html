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
if(n_x)
currentX=n_x;

current_active_noise_handler=d3.select(this).attr("id");
var VARR=current_active_noise_handler.split("_");
var signalandidx=VARR[2];

current_active_noise_signal=signalandidx.substring(0,3);
current_active_noise_serial=signalandidx.substring(3);

let selected_time_x=currentX.invert(d3.event.x);

console.log("selected_time_x:"+selected_time_x);
/* let x_idx=bisectB(lineArr[findSignalIdxof(current_active_noise_signal)],selected_time_x.getTime());
thetime=lineArr[findSignalIdxof(current_active_noise_signal)][x_idx].time;
 */

thetime=selected_time_x;

var time_s,time_e;
var is_start=false;
var loc="start";
if(VARR[3]=="s")
  is_start=true;
  
region_width=d3.select("#noise_section_"+current_active_noise_signal+current_active_noise_serial).attr("width");
prv_time_s=d3.select("#noise_section_"+current_active_noise_signal+current_active_noise_serial).attr("time_s");
prv_time_e=d3.select("#noise_section_"+current_active_noise_signal+current_active_noise_serial).attr("time_e");

if(is_start)
{
loc="start";
time_s=thetime;
time_e=new Date();
time_e.setTime(prv_time_e);
}
else
{
  loc="end";
time_s=new Date();
time_s.setTime(prv_time_s);
time_e=thetime;
}
if(is_start)
  d3.select("#noise_section_"+current_active_noise_signal+current_active_noise_serial).attr('x',currentX(time_s));
d3.select("#noise_section_"+current_active_noise_signal+current_active_noise_serial).attr('width',currentX(time_e)-currentX(time_s));

d3.select("#noise_section_"+current_active_noise_signal+current_active_noise_serial).attr("time_s",time_s.getTime());
d3.select("#noise_section_"+current_active_noise_signal+current_active_noise_serial).attr("time_e",time_e.getTime());
d3.select("#"+current_active_noise_handler).attr('cx',currentX(thetime));
if(!is_start)
{
  d3.select("#"+current_active_noise_handler.replace("_e","_x")).attr('cx',currentX(thetime)-12);
  d3.select("#"+current_active_noise_handler.replace("_e","_y")).attr('x',currentX(thetime)-12);
}




if(current_active_noise_signal=="ABP"){
  var signal_idx=-1;
  for(var j=0;j<noise_data_ABP.length;j++)
  {
    if(current_active_noise_serial==noise_data_ABP[j][0].toString())
    {
      signal_idx=j;
      break;
    }
  }
  if(signal_idx!=-1)
    noise_data_ABP[signal_idx]=[current_active_noise_serial,time_s.getTime(),time_e.getTime()];
}
else{//ICP
  var signal_idx=-1;
  for(var j=0;j<noise_data_ICP.length;j++)
  {
    if(current_active_noise_serial==noise_data_ICP[j][0].toString())
    {
      signal_idx=j;
      break;
    }
    
  }

  if(signal_idx!=-1)
    noise_data_ICP[signal_idx]=[current_active_noise_serial,time_s.getTime(),time_e.getTime()];

}


  current_active_region_idx=null;
  current_active_handler=null;




  d3.select(this).attr("cx",  d3.event.x);


  clearTimeout(noise_drag_rtime);
  noise_drag_rtime = setTimeout(function(){
    noise_drag_end(exp_id,current_active_noise_serial,loc,thetime.getTime());
  }, delta);
/* 

  noise_drag_rtime = new Date();
  if (noise_drag_timeout === false) {
      noise_drag_timeout = true;
      noise_drag_end(exp_id,current_active_noise_serial,loc,thetime.getTime());
      console.log("thetime:"+thetime);
  } */

}

function noise_drag_end(exp_id,serial,loc,thetime)
{
/*   if (new Date() - noise_drag_rtime < delta) {
    setTimeout(function (){ noise_drag_end(exp_id,serial,loc,thetime);}, delta);
  } else {
    noise_drag_timeout = false;
 */
    thetime_date=new Date();
    thetime_date.setTime(thetime);
    console.log("thetime2:"+thetime_date);
      obj={"serial":serial,"loc":loc,"new_value":thetime};
      patchAPI("/artifacts/",obj,function(data){

        
      });

/*   } */
}




function addNoiseAreaWithTime(serial,signal,time_s,time_e)
{
  chart_width=overview_chart_width;
  chart_height=overview_chart_height;
  margin=overview_chart_margin;

  currentX=f_x;
  if(n_x)
    currentX=n_x;
    

    var svg=d3.select("#chartlist svg");
   var circle_cy,rect_y;
  if(signal=="ABP"){
    
//    noise_data_ABP[noise_data_ABP.length]=[serial,time_s.getTime(),time_e.getTime()];
    rect_y=margin.top;
    circle_cy=margin.top+(chart_height)/2-5;
  }
  else{//ICP
    
  //  noise_data_ICP[noise_data_ICP.length]=[serial,time_s.getTime(),time_e.getTime()];
  
    rect_y=margin.top+chart_height+margin.middle;
    circle_cy=margin.top+chart_height+margin.middle+(chart_height)/2-5;

    
  }


  
  svg.append("svg:rect") 
    .attr("id", "noise_section_"+signal+serial)
    .attr("class", "noise_section")
    .attr('x', currentX(time_s) ) 
    .attr('y', rect_y) 
    .attr('width',currentX(time_e)-currentX(time_s)) 
    .attr('height', chart_height)
    .attr('fill', "#696969")
    .attr('fill-opacity', "0.5")
    .attr('stroke-opacity', "1")
    .attr('stroke', "#696969")
    .attr('stroke-width', 2)
    .attr("clip-path", "url(#clip)")
    .attr("time_s",time_s.getTime())
    .attr("time_e",time_e.getTime());


  
    svg.append("text")
    .attr("id", "noise_handler_"+signal+serial+"_y")
    .attr("class", "noise_handler noise_handler_"+signal+serial)
    .attr("y",  rect_y+16)
    .attr("x", currentX(time_e)-12 ) 
    .text("X")
    .attr("font-family", "sans-serif")
    .style("font-weight", "800")
    .attr("font-size", "12px")
    .attr("fill", "#000")
    .attr("text-anchor", "middle");


    svg.append("svg:circle") 
    .attr("id", "noise_handler_"+signal+serial+"_x")
    .attr("class", "noise_handler noise_handler_bg noise_handler_"+signal+serial)
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
      signal_serial=RArr[2].substring(3);

        
        deleteAPI("/artifacts/?serial="+signal_serial,{},function(data){

          d3.select("#noise_section_"+signal+signal_serial).remove();
          d3.selectAll(".noise_handler_"+signal+signal_serial).remove();
           
    
          if(signal=="ABP"){
            var signal_idx=-1;
            for(var j=0;j<noise_data_ABP.length;j++)
            {
              if(signal_serial==noise_data_ABP[j][0].toString())
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
              if(signal_serial==noise_data_ICP[j][0].toString())
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
      .attr("id", "noise_handler_"+signal+serial+"_s")
      .attr("class", "noise_handler noise_handler_"+signal+serial)
      .attr('cx', currentX(time_s)) 
      .attr('cy', circle_cy) 
      .attr('r', 10)
      .attr('fill',"#c0c0c0")
      .attr('opacity', '1')
      .attr("clip-path", "url(#clip)")
      .call(d3.drag().on("drag", noisedrag))
      .on("mousedown.zoom", null)
      .on("touchstart.zoom", null)
      .on("touchmove.zoom", null)
      .on("touchend.zoom", null);


      
      svg.append("svg:circle") 
      .attr("id", "noise_handler_"+signal+serial+"_e")
      .attr("class", "noise_handler noise_handler_"+signal+serial)
      .attr('cx',currentX(time_e) ) 
      .attr('cy', circle_cy)
      .attr('r', 10)
      .attr('fill', "#c0c0c0")
      .attr('opacity', '1')
      .attr("clip-path", "url(#clip)")
      .call(d3.drag().on("drag", noisedrag))
      .on("mousedown.zoom", null)
      .on("touchstart.zoom", null)
      .on("touchmove.zoom", null)
      .on("touchend.zoom", null);



  
  //현 차트 가운데 지점에 가상의 region 추가
  //Analyze 숨기기
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

function drawOverviewChart(parentId,h,data_ABP_idx,data_ICP_idx,chartname1,chartname2) {
//,noise_data_ICP,noise_data_ABP
    w=$("#"+parentId).width();
    d3.select("#"+parentId).selectAll("*").remove();
  
    let array1= lineArr[data_ABP_idx].map(x => x.time);
    let array2= lineArr[data_ICP_idx].map(x => x.time);

    ArrTimeMerged = [...new Set([...array1,...array2])];

    var margin = {top: 20, right: 10, bottom: 50, left: 80, middle:20};
    var chart_width = w - margin.left - margin.right;
    var chart_height = (h - margin.top - margin.bottom-margin.middle)/2;

    overview_chart_margin=margin;
    overview_chart_width=chart_width;
    overview_chart_height=chart_height;

    var extent = [
      [margin.left,margin.top], 
      [margin.left+chart_width, h-margin.bottom]
    ];
  
    var zoom=d3.zoom()
    .scaleExtent([1, 15])
    .extent(extent)
    .translateExtent([[margin.left, -Infinity], [margin.left+chart_width, Infinity]])
    .on("zoom", zoomed);
  
    const svg = d3.select("#"+parentId).append("svg")
    .attr("width", "100%")
    .attr("height", h)
    .attr("viewBox", "0 0 "+w+" "+h)
    .attr("preserveAspectRatio", "none")
    //.style("background-color","white")
    //.attr("fill","white")
    .call(zoom);
/*    .on("dblclick.zoom",function(){
      console.log(d3.event);
      current_memo_active_data_idx=data_ABP_idx;
      if(d3.event.y>margin.top+chart_height)
        current_memo_active_data_idx=data_ICP_idx;
      
      currentX=f_x;
      if(n_x)
        currentX=n_x;

      let selected_time_x=currentX.invert(d3.event.layerX);
      
      let x_idx=bisectB(lineArr[current_memo_active_data_idx],selected_time_x.getTime());



      showMemoPopup(current_memo_active_data_idx,x_idx);
      return false;
    });
*/
    svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .attr("width", chart_width )
    .attr("height", h);
       
  //  .attr("transform",  "translate(" + margin.left + "," + margin.top + ")");
  
  function zoomed() {
      var event=d3.event;
      const c_k=event.transform.k;
      const c_x=event.transform.x;

      w=$("#"+parentId).width();
      var chart_width = w - margin.left - margin.right;
      var chart_height = (h - margin.top - margin.bottom-margin.middle)/2;
      const svg = d3.select("#"+parentId+" svg");
      
      n_x = event.transform.rescaleX(f_x);
      var xAxis_n=d3.axisBottom(n_x).ticks(10).tickFormat(d3.timeFormat("%H:%M:%S"));

      for(var i=0;i<2;i++)
      {
        svg.select(".x-axis-"+i).call(xAxis_n);
      }
        svg.select(".x-guideline").call(d3.axisBottom(n_x).ticks(10).tickSize(-chart_height*2-margin.middle).tickFormat(""));
    

        svg.select(".chart1_path").attr("opacity",0.1);
        svg.select(".chart2_path").attr("opacity",0.1);
        
      rtime = new Date();
      if (timeout === false) {
          timeout = true;
          zoomedend(parentId,data_ABP_idx,data_ICP_idx,h,margin,chart_width);
      }
  }
  

  var parseTime = d3.timeParse("%d-%b-%y");
  f_x = d3.scaleTime().range([margin.left, chart_width+margin.left]);

  var Y1,Y2;
  
  Y1 = d3.scaleLinear().range([margin.top+chart_height, margin.top]);
  Y2 = d3.scaleLinear().range([margin.top+chart_height*2+margin.middle*(2-1), margin.top+(chart_height+margin.middle)*(2-1)]);


  f_x.domain([d3.min(ArrTimeMerged),d3.max(ArrTimeMerged)]);  
    Y1.domain([d3.min(lineArr[data_ABP_idx],function(c) { return c.x}),d3.max(lineArr[data_ABP_idx],function(c) { return c.x})]);
    Y2.domain([d3.min(lineArr[data_ICP_idx],function(c) { return c.x}),d3.max(lineArr[data_ICP_idx],function(c) { return c.x})]);
     
  
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

  // add the X gridlines
  svg.append("g")			
  .attr("class", "grid x-guideline")
  .attr("transform", "translate(0," + (chart_height*2+margin.middle+margin.top) + ")")
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



  var xAxis=d3.axisBottom(f_x).ticks(10).tickFormat(d3.timeFormat("%m-%d"));
  
  for(var i=0;i<2;i++)
  {
    svg.append("g")
    .attr("class", "axis x-axis-"+i)
    .attr("transform", "translate(0," + (margin.top+chart_height*(i+1)+margin.middle*(i)) + ")")
    .call(xAxis.tickFormat(d3.timeFormat("%H:%M:%S")))
    .selectAll("text")	
    .style("text-anchor", "middle");


   
  }
 

    svg
    .append("text")
    .attr("y", margin.top+(chart_height+margin.middle)*(1-1)+(margin.middle/3))
    .attr("x", 30)
    .attr("class", "chart_title_on_svg")
    
    .text(chartname1)
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
    .text(chartname2)
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("font-size", "15px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");

  
  var y1Axis,y2Axis;
  y1Axis = d3.axisLeft().scale(Y1);
  y2Axis = d3.axisLeft().scale(Y2);
  
  svg.append("g")
  .attr("class", "axis y-axis-1")
  .attr("transform", "translate("+margin.left+",0)")
  .call(y1Axis);

  svg.append("g")
  .attr("class", "axis y-axis-2")
  .attr("transform", "translate("+margin.left+",0)")
  .call(y2Axis);


  var valueline1 = d3.line()
.x(function(d) { return f_x(new Date(d.time)); })
.y(function(d) { return Y1(d.x); });

var valueline2 = d3.line()
.x(function(d) { return f_x(new Date(d.time)); })
.y(function(d) { return Y2(d.x); });

          

      var stroke_width=1.5;
  
      svg.append("path")
      .datum(lineArr[data_ABP_idx])
      .attr("class","chart1_path")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", stroke_width)
      .attr("clip-path", "url(#clip)")
      .attr("d", valueline1);

      svg.append("path")
      .datum(lineArr[data_ICP_idx])
      .attr("class","chart2_path")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", stroke_width)
      .attr("clip-path", "url(#clip)")
      .attr("d", valueline2);

      bisectA=d3.bisector(function(d) { 
        return  d;
      }).left;

      bisectB=d3.bisector(function(d) { 
        return d.time.getTime();
      }).left;

      console.log("------------regions------");
      console.log(annotation_regions);

      for(var i=0;i<3;i++)
      {
    
        var time_s;
        var time_e;
        if(annotation_regions[i])
        {
          time_s=annotation_regions[i].s;
          time_e=annotation_regions[i].e;
            svg.append("svg:rect") 
            .attr("id", "section"+i)
            .attr("class", "section")
            .attr('x', f_x(annotation_regions[i].s)) 
            .attr('y', margin.top) 
            .attr('width',f_x(time_e)-f_x(time_s)) // can't catch mouse events on a g element
            .attr('height', chart_height*2+margin.middle)
            .attr('fill', linecolor[i])
            .attr('fill-opacity', "0.3")
            .attr('stroke-opacity', "1")
            .attr('stroke', linecolor[i])
            .attr('stroke-width', 2)
            
            .attr("clip-path", "url(#clip)")
            .attr("time_s",time_s.getTime())
            .attr("time_e",time_e.getTime());

        }
        else{

            const the_s_x=margin.left+(chart_width/6)*(i*2)+(chart_width/12) ;
            const the_e_x=margin.left+(chart_width/6)*(i*2)+(chart_width/12) +chart_width/6;
            
            const time_s_x=f_x.invert(the_s_x);
            const s_x_idx=bisectA(ArrTimeMerged,time_s_x);
            
            time_s=ArrTimeMerged[s_x_idx];

            const time_e_x=f_x.invert(the_e_x);
            const e_x_idx=bisectA(ArrTimeMerged,time_e_x);
            time_e=ArrTimeMerged[e_x_idx];


            svg.append("svg:rect") // this is the black vertical line to follow mouse
            .attr("id", "section"+i)
            .attr("class", "section")
            .attr('x', f_x(time_s) ) // can't catch mouse events on a g element
            .attr('y', margin.top) // can't catch mouse events on a g element
            .attr('width',f_x(time_e)-f_x(time_s)) // can't catch mouse events on a g element
            .attr('height', chart_height*2+margin.middle)
            .attr('fill', linecolor[i])
            .attr('fill-opacity', "0.3")
            .attr('stroke-opacity', "1")
            .attr('stroke', linecolor[i])
            .attr('stroke-width', 2)
            .attr("clip-path", "url(#clip)")
            .attr("time_s",time_s.getTime())
            .attr("time_e",time_e.getTime());
        }
        
     //   svg.selectAll(".region_handler").enter()
    //    .attr('cx', margin.left+(chart_width/6)*(i*2)+(chart_width/12)+chart_width/6) 




        svg.append("svg:circle") 
        .attr("id", "region_handler_"+i+"_s")
        .attr("class", "region_handler region_handler_"+i)
        .attr('cx', f_x(time_s)) 
        .attr('cy', margin.top+(chart_height*2+margin.middle)/2-5) 
        .attr('r', 10)
        .attr('fill', linecolor[i])
        .attr('opacity', '1')
        .attr("clip-path", "url(#clip)")
        .call(d3.drag().on("drag", drag))
        .on("mousedown.zoom", null)
        .on("touchstart.zoom", null)
        .on("touchmove.zoom", null)
        .on("touchend.zoom", null);
        /*
        .on('mousedown', function() {
            var mouse = d3.mouse(this);
            console.log("start_moving_s"+i);
        })
        .on('mousemove', function() {
            var mouse = d3.mouse(this);
            console.log("moving_s"+i);
            
        })
        .on('mouseup', function() {
          var mouse = d3.mouse(this);
          console.log(mouse);
          let selected_time_x=x.invert(mouse.x);
          let x_idx=bisectA(ArrTimeMerged,selected_time_x);
          thetime=ArrTimeMerged[x_idx];
          console.log("id="+this.id);
          svg.select("#").attr('cx',x(thetime));

        }); */

        
        svg.append("svg:circle") 
        .attr("id", "region_handler_"+i+"_e")
        .attr("class", "region_handler region_handler_"+i)
        .attr('cx',f_x(time_e) ) 
        .attr('cy', margin.top+(chart_height*2+margin.middle)/2-5)
        .attr('r', 10)
        .attr('fill', linecolor[i])
        .attr('opacity', '1')
        .attr("clip-path", "url(#clip)")
        .call(d3.drag().on("drag", drag))
        .on("mousedown.zoom", null)
        .on("touchstart.zoom", null)
        .on("touchmove.zoom", null)
        .on("touchend.zoom", null);
      }



  
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



    
    


  
function drawOverviewChart_AMP_RAP(parentId,h,data_AMP,data_RAP,chartname1,chartname2)
 {
      w=$("#"+parentId).width();
      d3.select("#"+parentId).selectAll("*").remove();
    
      let array1= data_AMP.map(x => x.x);
      let array2= data_RAP.map(x => x.x);
  
      var ArrTimeMerged = [...new Set([...array1,...array2])];
  
      var margin = {top: 20, right: 10, bottom: 50, left: 80, middle:20};
      var chart_width = w - margin.left - margin.right;
      var chart_height = (h - margin.top - margin.bottom-margin.middle)/2;
  
      var extent = [
        [margin.left,margin.top], 
        [margin.left+chart_width, h-margin.bottom]
      ];
    
      var zoom=d3.zoom()
      .scaleExtent([1, 15])
      .extent(extent)
      .translateExtent([[margin.left, -Infinity], [margin.left+chart_width, Infinity]])
      .on("zoom", zoomed);
      
      const svg = d3.select("#"+parentId).append("svg")
      .attr("width", "100%")
      .attr("height", h)
      .attr("viewBox", "0 0 "+w+" "+h)
      .attr("preserveAspectRatio", "none")
      //.attr("fill","white")
      //.style("background-color","white")
      .call(zoom);
    
  
      svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", chart_width )
      .attr("height", h);
         
    //  .attr("transform",  "translate(" + margin.left + "," + margin.top + ")");
    
    
    function zoomed() {
  
      var event=d3.event;
   
        const c_k=event.transform.k;
        const c_x=event.transform.x;
  
      
    
         n_x2 = event.transform.rescaleX(f_x2);
  
        valueline1 = d3.line()
        .x(function(d) { return n_x2(new Date(d.x)); })
        .y(function(d) { return Y1(d.y); });
        
        valueline2 = d3.line()
        .x(function(d) { return n_x2(new Date(d.x)); })
        .y(function(d) { return Y2(d.y); });
  
        var xAxis_n=d3.axisBottom(n_x2).ticks(10).tickFormat(d3.timeFormat("%H:%M:%S"));
        
    
        for(var i=0;i<2;i++)
        {
          svg.select(".x-axis-"+i).call(xAxis_n);
        }
  
  
         //svg.select(".x-guideline").call(d3.axisBottom(n_x2).ticks(10).tickSize(-chart_height*2-margin.middle).tickFormat(""));
     
        svg.selectAll(".chart1_path").attr("d", valueline1);
        svg.selectAll(".chart2_path").attr("d", valueline2);
        

  
  
        
        
      
  
    
    
    }
    
    // parse the date / time
    var parseTime = d3.timeParse("%d-%b-%y");
    
    // set the ranges
    
    f_x2 = d3.scaleTime().range([margin.left, chart_width+margin.left]);
    //magnitudeChartType : log / linear
    var Y1,Y2;
    
    Y1 = d3.scaleLinear().range([margin.top+chart_height, margin.top]);
    Y2 = d3.scaleLinear().range([margin.top+chart_height*2+margin.middle*(2-1), margin.top+(chart_height+margin.middle)*(2-1)]);
  
  
    f_x2.domain([d3.min(ArrTimeMerged),d3.max(ArrTimeMerged)]);  
      Y1.domain([d3.min(data_AMP,function(c) { return c.y}),d3.max(data_AMP,function(c) { return c.y})]);
      Y2.domain([d3.min(data_RAP,function(c) { return c.y}),d3.max(data_RAP,function(c) { return c.y})]);
       
    
    let linecolor=["blue","#d031d4","#7ad669"];
    
    
    // gridlines in x axis function
    function make_x_gridlines() {		
    return d3.axisBottom(f_x2)
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
  
    // add the X gridlines

    /*
    svg.append("g")			
    .attr("class", "grid x-guideline")
    .attr("transform", "translate(0," + (chart_height+margin.top) + ")")
    .call(make_x_gridlines()
      .tickSize(-chart_height)
      .tickFormat("")
    );
    */
    // add the Y gridlines
    
    svg.append("g")			
    .attr("class", "grid Y1")
    .attr("transform", "translate("+margin.left+",0)")
    .call(make_y1_gridlines()
    .tickSize(-chart_width)
    .tickFormat("")
    );
  
    svg.append("g")			
    .attr("class", "grid Y2")
    .attr("transform", "translate("+margin.left+",0)")
    .call(make_y2_gridlines()
    .tickSize(-chart_width)
    .tickFormat("")
    );
  
  
  
    var xAxis=d3.axisBottom(f_x2).ticks(10).tickFormat(d3.timeFormat("%m-%d"));
    
    for(var i=0;i<2;i++)
    {
      svg.append("g")
      .attr("class", "axis x-axis-"+i)
      .attr("transform", "translate(0," + (margin.top+chart_height*(i+1)+margin.middle*(i)) + ")")
      .call(xAxis.tickFormat(d3.timeFormat("%H:%M:%S")))
      .selectAll("text")	
      .style("text-anchor", "middle");
  
  
     
    }
  
  
  
  
      
  
      svg
      .append("text")
      .attr("y", margin.top+(chart_height+margin.middle)*(1-1)+(margin.middle/3))
      .attr("x", 30)
      .attr("class", "chart_title_on_svg")
            .text(chartname1)
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px")
      .attr("fill", "black")
      .attr("text-anchor", "middle");
      
      svg
      .append("text")
      .attr("y", margin.top+(chart_height+margin.middle)*(2-1)+(margin.middle/3))
      .attr("x", 30)
      .attr("class", "chart_title_on_svg")
      .text(chartname2)
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px")
      .attr("fill", "black")
      .attr("text-anchor", "middle");
  
    
    var y1Axis,y2Axis;
    y1Axis = d3.axisLeft().scale(Y1);
    y2Axis = d3.axisLeft().scale(Y2);
    
    svg.append("g")
    .attr("class", "axis y-axis-1")
    .attr("transform", "translate("+margin.left+",0)")
    .call(y1Axis);
  
    svg.append("g")
    .attr("class", "axis y-axis-2")
    .attr("transform", "translate("+margin.left+",0)")
    .call(y2Axis);
  
  
    var valueline1 = d3.line()
  .x(function(d) { return f_x2(new Date(d.x)); })
  .y(function(d) { return Y1(d.y); });
  
  var valueline2 = d3.line()
  .x(function(d) { return f_x2(new Date(d.x)); })
  .y(function(d) { return Y2(d.y); });
  
            
  
        var stroke_width=1.5;
    
        svg.append("path")
        .datum(data_AMP)
        .attr("class","chart1_path")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", stroke_width)
        .attr("clip-path", "url(#clip)")
        .attr("d", valueline1);
  
        svg.append("path")
        .datum(data_RAP)
        .attr("class","chart2_path")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", stroke_width)
        .attr("clip-path", "url(#clip)")
        .attr("d", valueline2);
  
        bisectA=d3.bisector(function(d) { 
          return  d;
        }).left;
  
        bisectB=d3.bisector(function(d) { 
          return d.time.getTime();
        }).left;
  

  
  }