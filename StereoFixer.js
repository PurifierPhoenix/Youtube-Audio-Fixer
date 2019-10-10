/*PurifierPhoenix 
  Version 1.0
  10/10/2019
*/
var doesElementExist;


//just declared the variables here because the definitions need to be called after the labels are added or else it doesnt load on every tab
var audioCtx;
var video;
var output;
var splitter;
var merger;
var leftGain;
var rightGain;
var gain;
var initialValue = true;
var gainConnected = true; //for checking if gain is connected
var gain2Connected = true; //symmetric
var loaded = true;
var src;
var crossorigin;
var mutationObserver; //needed so I can disconnect it from anywhere
//Note- this fixes the element not being added sometimes, this works about 90% of the time, but randomly fails to add the element for whatever reason - switched to setTimeout() for fix

function afterNavigate() {
    	doesElementExist = document.getElementById('stereoFixer'); //grabs stereoFixer Element from html if it exists


  if ('/watch' === location.pathname) {


    	if(doesElementExist === null && '/watch' === location.pathname){ //if stereoFixer is not found the element is added, this prevents from multi elements being added
        console.log('afterNavigateElemNotFound');
      addElement();
  }


    }
}

var navx = function(event) { //for the afterNavigate(), seperated it so I could removeEventListener later
          console.log('event');
  if (event.propertyName === 'width' && event.target.id === 'progress') {

    afterNavigate();

  }

};

(document.body || document.documentElement).addEventListener('transitionend',
navx, true);
// After page load
afterNavigate(); //the only thing I found that works when initially going to youtube.com and then clicking on a video (it loads the custom element otherwise it would require a refresh of page	)
//Update-
//addElement();



////Toggle checkBoxes

//for default internalButton
  var def = false;
function toggleBoxes() {

 var monoBox = document.getElementsByClassName('monoBox')[0];
 var symBox =  document.getElementsByClassName('symBox')[0];

 //for color change on Toggle Button
 var pathSVG = document.getElementsByClassName('pathSVG')[0];

 //for changing toolkit pop-up
 var internalButton = document.getElementsByClassName('test ytp-button')[0];


if (monoBox.checked === true)
   {monoBox.checked = false;
    symBox.checked = true;
    pathSVG.setAttribute('fill','DodgerBlue'); //blue for symmetric
    internalButton.setAttribute('aria-label','Symmetric');
    internalButton.setAttribute('title','Symmetric');
    def = true;

   }
else if (def === true) { //reset 

    monoBox.checked = false;
    symBox.checked = false;
    pathSVG.setAttribute('fill','#FFFFFF'); //blue for symmetric
    internalButton.setAttribute('aria-label','Mono|Symmetric');
    internalButton.setAttribute('title','Mono|Symmetric');
    def = false;
}

else if (monoBox.checked === false)
   {
    symBox.checked = false;
    monoBox.checked = true;
    pathSVG.setAttribute('fill','PaleVioletRed '); //red for mono
    internalButton.setAttribute('aria-label','Mono');
    internalButton.setAttribute('title','Mono');
   }




}


function addElement(){

console.log(document.querySelector('video'));

loaded = true; //needed for the mutationObserver, so if the element is loaded again, it can connect to the sound as well

var stereoFixerDiv = document.createElement('div'); //create new element <div>
stereoFixerDiv.setAttribute('id','stereoFixer'); //set attributes of the new element <div id="sterofixer">
stereoFixerDiv.setAttribute('z-index','1000');

//Label
var labelElement = document.createElement('label');


//Mono
stereoFixerDiv.appendChild(labelElement);
var labelSpan = document.createElement('span');
labelSpan.setAttribute('class','text');
labelElement.appendChild(labelSpan);
var labelMonoText = document.createTextNode('Mono');
labelSpan.appendChild(labelMonoText);
var labelInput = document.createElement('input');
labelElement.appendChild(labelInput);
labelInput.setAttribute('type','checkbox');
labelInput.setAttribute('class','monoBox'); //reference the checkbox
labelInput.setAttribute('value','value');



//Symmetric
var labelSpan2 = document.createElement('span');
labelSpan2.setAttribute('class','text');
labelElement.appendChild(labelSpan2);
var labelStereoText = document.createTextNode('Symmetric');
labelSpan2.appendChild(labelStereoText);
var labelInput2 = document.createElement('input');
labelElement.appendChild(labelInput2);
labelInput2.setAttribute('type','checkbox');
labelInput2.setAttribute('class','symBox'); //reference the checkbox
labelInput2.setAttribute('value','value');







//sliders (left Channel)
var labelSpan3 = document.createElement('span');
labelSpan3.setAttribute('class','text');
labelElement.appendChild(labelSpan3);
var leftChannelSliderText = document.createTextNode('L');
labelSpan3.appendChild(leftChannelSliderText);
var labelLeftSlider = document.createElement('input');
labelElement.appendChild(labelLeftSlider);
labelLeftSlider.setAttribute('type','range');
labelLeftSlider.setAttribute('id','leftslider');
labelLeftSlider.setAttribute('min','0');
labelLeftSlider.setAttribute('max','100');
labelLeftSlider.setAttribute('value','100');
labelLeftSlider.setAttribute('step','1');


//text fields for sliders (left)
var textFieldLeftSlider = document.createElement('input');
textFieldLeftSlider.setAttribute('id','leftInputValue');
textFieldLeftSlider.setAttribute('type','number');
textFieldLeftSlider.setAttribute('min','0');
textFieldLeftSlider.setAttribute('max','100');
textFieldLeftSlider.setAttribute('value','100');
textFieldLeftSlider.setAttribute('step','1');
labelElement.appendChild(textFieldLeftSlider);


var getRightControlsDiv = document.getElementsByClassName('ytp-right-controls');

//sliders (right Channel)

var labelSpan4 = document.createElement('span');
labelSpan4.setAttribute('class','text');
labelElement.appendChild(labelSpan4);
var rightChannelSliderText = document.createTextNode('R');
labelSpan4.appendChild(rightChannelSliderText);
var labelRightSlider = document.createElement('input');

labelRightSlider.setAttribute('type','range');
labelRightSlider.setAttribute('id','rightslider');
labelRightSlider.setAttribute('min','0');
labelRightSlider.setAttribute('max','100');
labelRightSlider.setAttribute('value','100');
labelRightSlider.setAttribute('step','1');
labelElement.appendChild(labelRightSlider);

var getRightControlsDiv = document.getElementsByClassName('ytp-right-controls');
//text fields for sliders (right)
var textFieldRightSlider = document.createElement('input');
textFieldRightSlider.setAttribute('id','rightInputValue');
textFieldRightSlider.setAttribute('type','number');
textFieldRightSlider.setAttribute('min','0');
textFieldRightSlider.setAttribute('max','100');
textFieldRightSlider.setAttribute('value','100');
textFieldRightSlider.setAttribute('step','1');
labelElement.appendChild(textFieldRightSlider)

var addButton = document.createElement('button');
addButton.className = 'test ytp-button';

//addButton.setAttribute('onclick','a()'); 
addButton.setAttribute('aria-label','Mono|Symmetric');
addButton.setAttribute('title','Mono|Symmetric');

//Note-fixed the viewBox, it was initially 0 0 36 36, but -9 -9 centers it way better without having to do css adjusting.
addButton.innerHTML = '<svg height="100%" version="1.1" viewBox="-9 -9 36 36" width="100%"><path class=pathSVG d="M 11.00,122.00            C 7.86,121.95 4.82,121.96 2.43,119.57              -0.36,116.78 0.01,112.62 0.00,109.00              0.00,109.00 0.00,57.00 0.00,57.00              0.13,47.41 3.12,46.02 12.00,46.00              12.00,46.00 47.00,46.00 47.00,46.00              57.67,45.98 59.19,42.04 67.00,35.28              67.00,35.28 94.00,12.00 94.00,12.00              99.01,7.43 106.76,-0.85 114.00,0.15              121.13,1.14 120.99,7.40 121.00,13.00              121.00,13.00 121.00,110.00 121.00,110.00              127.20,106.25 128.70,107.05 135.00,110.00              137.57,100.45 139.79,96.66 140.49,86.00              141.49,70.58 133.13,58.60 131.70,54.00              129.49,46.89 135.46,41.55 141.00,42.66              146.84,43.83 150.01,51.05 152.13,56.00              158.08,69.89 159.83,85.25 156.35,100.00              155.44,103.84 153.67,109.39 152.13,113.00              151.26,115.03 149.05,118.87 149.23,120.96              149.53,124.39 155.35,128.16 158.00,130.00              161.22,123.31 164.02,119.48 166.48,112.00              172.48,93.79 172.48,75.21 166.48,57.00              162.09,43.67 155.25,37.56 153.65,32.00              151.59,24.83 157.54,19.32 163.00,20.47              170.89,22.15 178.54,39.92 181.40,47.00              189.89,68.03 190.82,93.38 183.97,115.00              180.50,125.96 176.24,133.09 171.00,143.00              171.00,143.00 180.00,149.00 180.00,149.00              184.96,138.68 189.00,133.86 193.31,122.00              200.97,100.87 201.67,75.60 195.57,54.00              192.13,41.80 185.16,28.32 177.86,18.00              174.64,13.45 170.81,8.44 175.43,3.23              181.29,-3.39 187.81,1.56 191.84,7.00              199.95,17.95 206.12,30.07 210.33,43.00              222.37,79.93 218.41,121.23 197.00,154.00              197.00,154.00 227.00,154.00 227.00,154.00              230.62,154.02 233.87,153.85 236.77,156.43              240.35,159.60 239.99,163.67 240.00,168.00              240.00,168.00 240.00,220.00 240.00,220.00              239.86,230.15 236.06,230.99 227.00,231.00              227.00,231.00 192.00,231.00 192.00,231.00              182.58,231.06 178.79,236.02 172.00,242.05              172.00,242.05 145.00,265.57 145.00,265.57              140.21,269.65 132.60,277.77 126.00,276.76              118.88,275.67 119.01,269.65 119.00,264.00              119.00,264.00 119.00,167.00 119.00,167.00              112.29,169.83 111.68,169.08 105.00,167.00              101.27,180.86 97.38,187.54 100.67,203.00              103.21,214.95 108.86,220.40 108.79,226.00              108.72,231.45 104.19,234.55 99.00,233.76              92.98,232.84 90.61,225.87 88.26,221.00              81.28,206.55 80.08,188.41 84.43,173.00              84.43,173.00 90.77,156.00 90.77,156.00              90.46,152.37 84.67,148.32 82.00,146.00              82.00,146.00 73.36,165.00 73.36,165.00              67.71,181.79 67.70,200.08 72.72,217.00              75.08,224.95 76.64,227.90 80.86,235.00              82.86,238.36 86.20,242.19 86.76,246.00              87.95,254.19 79.69,258.63 73.17,254.11              67.88,250.44 61.64,237.16 59.20,231.00              51.18,210.75 49.04,188.22 54.48,167.00              56.15,160.49 59.47,152.13 62.31,146.00              62.31,146.00 66.90,137.00 66.90,137.00              68.07,132.73 62.80,129.58 60.00,127.00              57.18,134.63 51.30,141.20 45.86,157.00              38.38,178.76 38.99,203.04 45.15,225.00              48.28,236.13 55.73,249.72 62.56,259.00              65.82,263.42 68.85,268.77 64.49,273.72              58.89,280.09 52.27,275.18 48.43,269.98              39.22,257.56 34.50,247.50 29.67,233.00              16.98,194.91 22.46,156.24 43.00,122.00              43.00,122.00 11.00,122.00 11.00,122.00 Z" transform="scale(0.075)" fill="#fff" ></svg>';

addButton.addEventListener("click",toggleBoxes);

// getRightControlsDiv[0].appendChild(addButton);


getRightControlsDiv[0].insertBefore(addButton,getRightControlsDiv[0].childNodes[0]);














var interval = null;
interval = setInterval(function () {
//audio context - putting this here fixes the stupid video Dom element being null because if I call it at the top, it loads before the DOM elements actually loaded on the page lol
if(loaded){

  //NOTE-added this here because player-container was returning null otherwise, before it was on line 186
  //get the div from document that will be used for placing the above elements
  var currentDiv = document.getElementById('player-container'); //new youtube
  if (currentDiv === null) {

    currentDiv = document.getElementById('player-api'); //old youtube
  }


audioCtx = new (window.AudioContext || window.webkitAudioContext)();
video = document.querySelector('video'); //DOM element

//Cannot read property 'src' of null - seems to have fixed the problem

  video = document.querySelector('video'); //DOM element


    if (video !== null) {//not null proceed
    console.log('video is not null');

    //appending here will fix that shit from showing up above the video :))))))))) 03/06/2017


    currentDiv.appendChild(stereoFixerDiv); //StereoFixerDiv is injected as a child of player-api
    clearInterval(interval); //stop the interval process if video is not null
    src = (video.src ? video.src : video.currentSrc);
    crossorigin = video.getAttribute('crossorigin');
    video.crossOrigin = 'anonymous';
    document.querySelector('video').crossOrigin = 'anonymous';





//having the below fixes the stupid muting problem on some video ads - crossorigin

//cross origin bullshit
//document.getElementsByTagName("video")[0].setAttribute('crossorigin','anonymous');

//video.load();
     
        if (src) { //have to play() the video from here or else it will pause for whatever reason

            //the if statement below will not always be true on cors ads, example jimmy kimmel video ads get muted unless I explicity declared crossOrigin anonymous
            //this is for other crossOrigin ad sites, example First We Feast
            if (document.location.hostname != getHostName(src) && 'blob:' != src.substring(0, 5) && !crossorigin) {
              video.setAttribute('crossorigin', (crossorigin ? crossorigin : 'anonymous'));
           if (video.src) {     //this will be true most of the time
//TODO: FIX the reloading video shit for ads

                                    video.src = '' + video.src;
                                    video.pause();
                                  video.load();
                                    video.play();

console.log(document.querySelector('video'));

                                } else { //just in case
                                    if (video.currentSrc) {
                                        console.log("lol");
                                        video.pause();
                                        video.load();
                                        video.play();
                                    }
                                }}}




output = audioCtx.createMediaElementSource(video); //connect to the dom element for Web Audio API manipulation
//for symmetric
console.log(audioCtx);
splitter = audioCtx.createChannelSplitter(2); //for increasing volume on each channel seperately
merger = audioCtx.createChannelMerger(2); //used for merging channels into one source of sound
leftGain = audioCtx.createGain(); //initialize gains = this is used for volume
rightGain = audioCtx.createGain();
// leftGain.gain.value = 1.0; //left channel volume
// rightGain.gain.value = 1.0; //right channel volume


//***NOTE*** - if I use 0 only left sound will be added to both channels, 1 is only right channel sound will be added to both channels,
//if I do both, then both left and right channels will be added to both, creating symmetrical sound //Logic--> say left sound was louder than right
//Logic-> left channel(50 db(louder side)) and right channel(30 db(quieter side)), by adding each sides sound to both channels = 50 + 35 = 85 & 35 + 50 = 85 = essentially both sides are equal in db now :)
splitter.connect(leftGain,0); //connect the left channel volume to splitter //NOTE - SEE 453
splitter.connect(rightGain,1); //connect the right channel volume to splitter


//NOTE- SEE 453 for the reason why this is commented out
// splitter.connect(leftGain,1); //connect the left channel volume to splitter
// splitter.connect(rightGain,0); //connect the right channel volume to splitter

// //merge both channels into 1 audio source
 leftGain.connect(merger, 0, 0);	//merge, audio source index, channel 0 is left 1 is right
 rightGain.connect(merger,0,1);

gain = audioCtx.createGain();
gain.channelCountMode = 'explicit'; //explicit means I can define the max number of channels with channelCount
//gain.channelCount = 2; //this allows mono sound, only 1 channel but plays on both speakers 1 = mono 2 = stereo
output.connect(gain); //connects the gain

output.connect(audioCtx.destination); //this one is required just to play the regular sound

loaded = false;
//setInterval(valueOfSliderAndInputBox,100); //updates value of sliders and textbox
setInterval(updateChecker, 500); //checking for checkbox checked
(document.body || document.documentElement).removeEventListener('transitionend',navx,true); //remove eventlistener after initial load
    //this will through an error but still disconnects the mutation observer.......
    mutationObserver.disconnect(); //disconnect the mutationObserver as it's not needed anymore

}


}
}, 1000);
}




//NOTE- i dont think this is ever reached
timeout();
function timeout() {


  setTimeout(function() {

    doesElementExist = document.getElementById('stereoFixer');
if(doesElementExist === null) {
if($("video") === null)
{
  return timeout();
}
else {
  $("video").onplay  = function (){
        addElement();
  }
}
}
 else {
   return;
 }
    },100);
}
/*
//taken from autoreplay api - TODO: make this into pure javascript
var mutationObserver = new MutationObserver(function(mutations, observer) {
    for (var i = 0; i < mutations.length; ++i) {
        for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
            var node = $(mutations[i].addedNodes[j]);
            if (node.is("video.html5-main-video")) {
                node.one('loadedmetadata', function(e) {
                    if (!isNaN(e.target.duration)) {
                      doesElementExist = document.getElementById('stereoFixer');
                      if(doesElementExist === null) {
                      console.log('1');
                            addElement();
                          }
                    }
                });
            } else if (node.is("#movie_player") && !node.is("div")) {
                console.log('2');
                addElement();
            }
        }
    }
});
*/

mutationObserver = new MutationObserver(function(mutations, observer) {
    for (var i = 0; i < mutations.length; ++i) {
        for (var j = 0; j < mutations[i].addedNodes.length; ++j) {


            var node = $(mutations[i].addedNodes[j]);

         if (node.is("video.html5-main-video")) {

                node.one('loadedmetadata', function(e) {

                    if (!isNaN(e.target.duration)) {
                      doesElementExist = document.getElementById('stereoFixer');

                      if(doesElementExist === null && '/watch' === location.pathname) { //added location.path(NOTE-remove this if it cause issues) to check whether the user is on /user /watch = should only work on /channel
                      console.log('mutation');

                      addElement();
                          }
                    }
                });
            } else if (node.is("#movie_player") && !node.is("div")) {
                console.log('movie_player');
                addElement();
            }
        }
    }
});
mutationObserver.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true
});



/*

//Suggestion: try this alone without the progressbar trick at the top
//Update: this seems to work perfectly without^^
setTimeout(function(){  //this is a function that will run only once just in case the element is not added for whatever reason,
	doesElementExist = document.getElementById('stereoFixer'); //grabs stereoFixer Element from html if it exists

	if(doesElementExist !== null){
		return;
	}

	else
	 {

		addElement();
	}

}, 1000); //1500 seems to fix that issue where the design is put above the video
*/

//change channel value with either slider or number input
/*
function valueOfSlider() {
  doesElementExist = document.getElementById('stereoFixer'); //grabs stereoFixer Element from html if it exists

  if(doesElementExist !== null){


document.getElementById('leftslidervalue').value = document.getElementById('leftslider').value; //as you slide the slider, it will change the number input box value

document.getElementById('leftslider').value = document.getElementById('leftslidervalue').value; //the slider will adjust as you put in number

  }

  else {
    addElement();
  }


}*/






//checking for changes such as checking or unchecking checkboxes, moving sliders, etc...
function updateChecker() {

    doesElementExist = document.getElementById('stereoFixer'); //grabs stereoFixer Element from html if it exists

    if(doesElementExist !== null){




//TODO:Simpifly this mess underneath (SliderInput functions), create 1 function that does of the things and just call it for each oninput (06/15/2017)
//----------------Left Channel Slider/Input-------------------//

 //assigns slider value to the input number box as you slide it
  document.getElementById("leftslider").oninput = function() {

  var Value = document.getElementById('leftslider').value;
  document.getElementById('leftInputValue').value = Value;
  leftGain.gain.value = Value/100; //sets the volume of left Channel
  console.log( leftGain.gain.value);

  if(initialValue) { //only do it once if u move sliders or change input value
    output.connect(audioCtx.destination); //connecting here before disconnecting because of line 432, so no errors occur
     output.disconnect(audioCtx.destination); //have to disconnect orginial output first or else you can't fully turn down the volume
     output.connect(splitter,0,0); //NOTE- connecting the splitter to output with the extra parameter of 0,0 makes it stereo sound aka officially making the sliders non boosted and individually controlled :)
     merger.connect(audioCtx.destination); //connect the merger to destination so we can hear the sound
     initialValue = false;
  }

      };

   //assigns input number value to slider
   document.getElementById("leftInputValue").oninput = function() {

     var Value = document.getElementById('leftInputValue').value;
    document.getElementById('leftslider').value = Value;
       leftGain.gain.value = Value/100; //sets the volume of left Channel
        console.log( leftGain.gain.value);
        if(initialValue) { //only do it once if u move sliders or change input value
          output.connect(audioCtx.destination); //connecting here before disconnecting because of line 432, so no errors occur
           output.disconnect(audioCtx.destination); //have to disconnect orginial output first or else you can't fully turn down the volume
           output.connect(splitter,0,0); //0,0 means stereo :)
           merger.connect(audioCtx.destination); //connect the merger to destination so we can hear the sound
           initialValue = false;
        }

   };

//----------------Right Channel Slider/Input-------------------//

   //assigns slider value to the input number box as you slide it
    document.getElementById("rightslider").oninput = function() {

  var Value = document.getElementById('rightslider').value;
  document.getElementById('rightInputValue').value = Value;
  rightGain.gain.value = Value/100; //sets the volume of right Channel
  console.log( rightGain.gain.value);
  if(initialValue) { //only do it once if u move sliders or change input value
    output.connect(audioCtx.destination); //connecting here before disconnecting because of line 432, so no errors occur
     output.disconnect(audioCtx.destination); //have to disconnect orginial output first or else you can't fully turn down the volume
     output.connect(splitter,0,0); //0,0 means stereo :)
     merger.connect(audioCtx.destination); //connect the merger to destination so we can hear the sound
     initialValue = false;
  }

        };

//assigns input number value to slider
     document.getElementById("rightInputValue").oninput = function() {

     var Value = document.getElementById('rightInputValue').value;
     document.getElementById('rightslider').value = Value;
     rightGain.gain.value = Value/100; //sets the volume of right Channel
     console.log( rightGain.gain.value);

  if(initialValue) { //only do it once if u move sliders or change input value
    output.connect(audioCtx.destination); //connecting here before disconnecting because of line 432, so no errors occur
     output.disconnect(audioCtx.destination); //have to disconnect orginial output first or else you can't fully turn down the volume
     output.connect(splitter,0,0); //0,0 means stereo :)
     merger.connect(audioCtx.destination); //connect the merger to destination so we can hear the sound
     initialValue = false;
  }
     };




if(document.getElementsByClassName('monoBox')[0].checked) //true mono
{
	if(gainConnected){

   output.connect(audioCtx.destination); //connecting here before disconnecting, so no errors occur
   output.disconnect(audioCtx.destination); //disconnect regular sound as it distorts this shit

   //splitter.connect(leftGain,0); //connect the left channel volume to splitter //NOTE - SEE 453
   //splitter.connect(rightGain,1); //connect the right channel volume to splitter


   //NOTE- SEE 453 for the reason why this is commented out
   // splitter.connect(leftGain,1); //connect the left channel volume to splitter
   // splitter.connect(rightGain,0); //connect the right channel volume to splitter

   // //merge both channels into 1 audio source
   //leftGain.disconnect(merger, 0, 0);	//merge, audio source index, channel 0 is left 1 is right
   //rightGain.disconnect(merger,0,1);
splitter.disconnect(leftGain,0);
splitter.disconnect(rightGain,1);

		//This will create a mono sound without having to test for decibels :)
	gain.channelCount = 1; //toggles mono
  //the gain has to connect here or else it messes with the merger




//NOTE --07/03 2am ---- dual mono + sliders working together ? --YES !
gain.connect(splitter,0,0); //0,0 means stereo :)
gain.connect(leftGain,0);
gain.connect(rightGain,0);






  //splitter.connect(gain,0,0); //NOTE -TODO -NOTE- this alone makes a wierd ass constant buzz noise :X - sidenote - gain.connect(splitter,0,0) has to be on as well


  merger.connect(audioCtx.destination); //connect the merger to destination so we can hear the sound
  //gain.connect(audioCtx.destination); //This is so you could actually hear the sound :) //NOTE - 07/03 -- COMMENTED THIS OUT AND CONNECTED SPLITTER TO GAIN AND THEN MERGED THE SOUND //NOTE (DUAL MONO?) --this allows me to manupilate the sliders as well.
	console.log(gain.channelCount);
	console.log("mono is checked");
  gainConnected = false;
	}

}


else if(!document.getElementsByClassName('monoBox')[0].checked) //false
{

if(!gainConnected)
	{
//NOTE -- added 2 lines below for dual mono disconnect

    gain.disconnect(leftGain,0);
    gain.disconnect(rightGain,0);
    gain.disconnect(splitter,0,0); //0,0 means stereo :)
    merger.disconnect(audioCtx.destination); //connect the merger to destination so we can hear the sound

    //needed to reconnect this in order for regular sound to go back to the way it was
    splitter.connect(leftGain,0);
    splitter.connect(rightGain,1);


		gain.channelCount = 2; //this defaults back to stereo
		console.log(gain.channelCount);
    output.connect(splitter,0,0);
      //gain.disconnect(audioCtx.destination); //This is so you could actually hear the sound :)
         merger.connect(audioCtx.destination); //reconnect merger to back to regular audio instead of output.connect() -NOTE- helps fix transition of on/off switching the mono when sliders have been moved
		gainConnected = true;
			console.log("mono is unchecked");
}

}
if (document.getElementsByClassName('symBox')[0].checked) //true symmetric
{
 if(gain2Connected){
   output.connect(audioCtx.destination); //connecting here before disconnecting because of line 432, so no errors occur
   output.disconnect(audioCtx.destination); //disconnect regular sound as it distorts this shit

   //adding symmetric
   splitter.connect(leftGain,1); //connect the left channel volume to splitter
   splitter.connect(rightGain,0); //connect the right channel volume to splitter

 output.connect(splitter,0,0); //connect the splitter to the audio source --NOTE -- 07/03 -- this was without the 0,0
merger.connect(audioCtx.destination); //connect the merger to destination so we can hear the sound
gain2Connected = false;
 }

}
else if (!document.getElementsByClassName('symBox')[0].checked) //false symmetric
{
 if(!gain2Connected){
 //disconnecting symmetric
  splitter.disconnect(leftGain,1); //connect the left channel volume to splitter
  splitter.disconnect(rightGain,0); //connect the right channel volume to splitter
  output.disconnect(splitter);
  merger.disconnect(audioCtx.destination);
 //NOTE -- the below was added to remedy the slider + symmetric (on/off) interference
  output.connect(splitter,0,0); //0,0 means stereo :)
  merger.connect(audioCtx.destination); //connect the merger to destination so we can hear the sound
//output.connect(audioCtx.destination); //reconnect the regular sound //NOTE (07/03/2017) -- commented this out to fix the interference issue with slider + symmetric (on/off switched)
//merger.connect(audioCtx.destination); //connect the merger to destination so we can hear the sound
  gain2Connected = true;
 }

}




}
else
     {
       console.log("hello");

       addElement();
    }
}


//https://www.youtube.com/watch?v=2OFKM2G-dE8&t=198s <-- the video that messes up the sound switching :/

//the problem is due to ads and that sound doesn't work in ads
//UPDATE - problem has been resolved

  function getHostName(url) {
                if ('blob:' == url.substring(0, 5)) {
                    url = url.replace('blob:', '');
                    url = unescape(url);
                }
                var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
                if (match !== null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
                    return match[2];
                } else {
                    return null;
                }
            }



