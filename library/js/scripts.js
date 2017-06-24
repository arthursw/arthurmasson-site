/*
 * Bones Scripts File
 * Author: Eddie Machado
 *
 * This file should contain any js scripts you want to add to the site.
 * Instead of calling it in the header or throwing it inside wp_head()
 * this file will be called automatically in the footer so as not to
 * slow the page load.
 *
 * There are a lot of example functions and tools in here. If you don't
 * need any of it, just remove it. They are meant to be helpers and are
 * not required. It's your world baby, you can do whatever you want.
*/


/*
 * Get Viewport Dimensions
 * returns object with viewport dimensions to match css in width and height properties
 * ( source: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript )
*/
function updateViewportDimensions() {
	var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
	return { width:x,height:y };
}
// setting the viewport width
var viewport = updateViewportDimensions();


/*
 * Throttle Resize-triggered Events
 * Wrap your actions in this function to throttle the frequency of firing them off, for better performance, esp. on mobile.
 * ( source: http://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed )
*/
var waitForFinalEvent = (function () {
	var timers = {};
	return function (callback, ms, uniqueId) {
		if (!uniqueId) { uniqueId = "Don't call this twice without a uniqueId"; }
		if (timers[uniqueId]) { clearTimeout (timers[uniqueId]); }
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();

// how long to wait before deciding the resize has stopped, in ms. Around 50-100 should work ok.
var timeToWaitForLast = 100;


/*
 * Here's an example so you can see how we're using the above function
 *
 * This is commented out so it won't work, but you can copy it and
 * remove the comments.
 *
 *
 *
 * If we want to only do it on a certain page, we can setup checks so we do it
 * as efficient as possible.
 *
 * if( typeof is_home === "undefined" ) var is_home = $('body').hasClass('home');
 *
 * This once checks to see if you're on the home page based on the body class
 * We can then use that check to perform actions on the home page only
 *
 * When the window is resized, we perform this function
 * $(window).resize(function () {
 *
 *    // if we're on the home page, we wait the set amount (in function above) then fire the function
 *    if( is_home ) { waitForFinalEvent( function() {
 *
 *	// update the viewport, in case the window size has changed
 *	viewport = updateViewportDimensions();
 *
 *      // if we're above or equal to 768 fire this off
 *      if( viewport.width >= 768 ) {
 *        console.log('On home page and window sized to 768 width or more.');
 *      } else {
 *        // otherwise, let's do this instead
 *        console.log('Not on home page, or window sized to less than 768.');
 *      }
 *
 *    }, timeToWaitForLast, "your-function-identifier-string"); }
 * });
 *
 * Pretty cool huh? You can create functions like this to conditionally load
 * content and other stuff dependent on the viewport.
 * Remember that mobile devices and javascript aren't the best of friends.
 * Keep it light and always make sure the larger viewports are doing the heavy lifting.
 *
*/

/*
 * We're going to swap out the gravatars.
 * In the functions.php file, you can see we're not loading the gravatar
 * images on mobile to save bandwidth. Once we hit an acceptable viewport
 * then we can swap out those images since they are located in a data attribute.
*/
function loadGravatars() {
  // set the viewport using the function above
  viewport = updateViewportDimensions();
  // if the viewport is tablet or larger, we load in the gravatars
  if (viewport.width >= 768) {
  jQuery('.comment img[data-gravatar]').each(function(){
    jQuery(this).attr('src',jQuery(this).attr('data-gravatar'));
  });
	}
} // end function




// creates a global "addWheelListener" method
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
function createWheelListener() {

  var prefix = "", _addEventListener, support;

  // detect event model
  if ( window.addEventListener ) {
      _addEventListener = "addEventListener";
  } else {
      _addEventListener = "attachEvent";
      prefix = "on";
  }

  // detect available wheel event
  support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
            document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
            "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

  window.addWheelListener = function( elem, callback, useCapture ) {
      _addWheelListener( elem, support, callback, useCapture );

      // handle MozMousePixelScroll in older Firefox
      if( support == "DOMMouseScroll" ) {
          _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
      }
  };

  function _addWheelListener( elem, eventName, callback, useCapture ) {
      elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
          !originalEvent && ( originalEvent = window.event );

          // create a normalized event object
          var event = {
              // keep a ref to the original event object
              originalEvent: originalEvent,
              target: originalEvent.target || originalEvent.srcElement,
              type: "wheel",
              deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
              deltaX: 0,
              deltaY: 0,
              deltaZ: 0,
              preventDefault: function() {
                  originalEvent.preventDefault ?
                      originalEvent.preventDefault() :
                      originalEvent.returnValue = false;
              }
          };
          
          // calculate deltaY (and deltaX) according to the event
          if ( support == "mousewheel" ) {
              event.deltaY = - 1/40 * originalEvent.wheelDelta;
              // Webkit also support wheelDeltaX
              originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
          } else {
              event.deltaY = originalEvent.deltaY || originalEvent.detail;
          }

          // it's time to fire the callback
          return callback( event );

      }, useCapture || false );
  }
}


/*
 * Put all your regular jQuery in here.
*/
jQuery(document).ready(function($) {

  /*
   * Let's fire off the gravatar function
   * You can remove this if you don't need it
  */
  loadGravatars();
  // createWheelListener()

  // addWheelListener( document.body, function( e ) { 
    
    
  //   let currentOffset = $(document).scrollTop()
  //   console.log( 'wheel event: ' + e.deltaY)
  //   if(e.deltaY > 0) {
  //     console.log( '    currentOffset: ' + currentOffset )


  //     let nextOffset = null
  //     for(let article of $('article')) {
  //       let yOffset = Math.floor($(article).offset().top)
  //       if(yOffset > currentOffset && (nextOffset == null || yOffset < nextOffset)) {
  //         nextOffset = yOffset
  //       }
  //     }
  //     console.log( '    nextOffset: ' + nextOffset )
  //     console.log( '   nextOffset - currentOffset: ' + (nextOffset - currentOffset) )

  //     $('html, body').animate({
  //         scrollTop: nextOffset
  //     }, nextOffset - currentOffset );

  //   } else {

  //     let previousOffset = null
  //     for(let article of $('article')) {
  //       let yOffset = Math.ceil($(article).offset().top)
  //       if(yOffset < currentOffset && (previousOffset == null || yOffset > previousOffset)) {
  //         previousOffset = yOffset
  //       }
  //     }

  //     $('html, body').animate({
  //         scrollTop: previousOffset
  //     },  currentOffset - previousOffset );

  //   }
    
  //   e.preventDefault()
  // } )

let mouseX = null
let mouseY = null

$(document).ready(function() {
  let articlesJ = $('article')
  articlesJ.draggable({ cancel: 'p,input,textarea,button,select,option,h1' })


  $(document.body).mousemove(function( event ) {
      mouseX = event.pageX
      mouseY = event.pageY
  })

  // function update() {
  //   requestAnimationFrame( update );
  //   for(let article of articlesJ) {
  //     let articleJ = $(article)
  //     if(articleJ.hasClass('ui-draggable-dragging')) {
  //       continue;
  //     }
  //     let position = articleJ.offset()
  //     let distX = mouseX - position.left
  //     let distY = mouseY - position.top
  //     let distSquared = 0.1 * Math.sqrt(distX * distX + distY * distY)
  //     articleJ.offset({left: position.left + distX / distSquared, top: position.top + distY / distSquared})
  //   }
  // }
  // update()

  // for(let article of articlesJ) {
  //   let articleJ = $(article)
  //   articleJ.offset( { left: (window.innerWidth - articleJ.outerWidth()) * Math.random(), 
  //                        top: (window.innerHeight - articleJ.outerWidth()) * Math.random() } )
  // }

  // $('#fullpage').fullpage({

  //   afterLoad: function(anchorLink, index){
  //     var loadedSection = $(this);

  //     //using index
  //     if(index == 5){
  //         alert("Section 3 ended loading");
  //     }

  //     //using anchorLink
  //     if(anchorLink == 'secondSlide'){
  //       alert("Section 2 ended loading");
  //     }
  //   }

  // });

});
  // new Philter({
  //   transitionTime: 0.5, // hover transition time
  //   url: './wp-content/themes/arthur-bones/library/js/philter/', // philter directory
  //   tag: true // 'philter' in data attributes
  // });

}); /* end of as page load scripts */
