// Swipe Gallery usage:

// gallerySelector: the selector of the gallery containing all gallery items
// galleryItemType: the type of the gallery item: DIV, A, DL, LI, etc.
// The galleryItemType cannot contain of be contained in another element of the same type
// The gallery items must be of type <a> and must contain the images <img>


// To find the size of the image: 
// 1. small size: look in the src attribute of <img> find imageName-WIDTHxHEIGHT.ext
// 2. large size: look in the href attribute of the parent <a> find imageName-WIDTHxHEIGHT.ext

// the item gallery must be direct children of the gallery


var initPhotoSwipeFromDOM = function(gallerySelector, galleryItemType) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    // var parseThumbnailElements = function(el) {
    //     var thumbElements = el.childNodes,
    //         numNodes = thumbElements.length,
    //         items = [],
    //         figureEl,
    //         linkEl,
    //         size,
    //         item;

    //     for(var i = 0; i < numNodes; i++) {

    //         figureEl = thumbElements[i]; // <figure> element

    //         // include only element nodes 
    //         if(figureEl.nodeType !== 1) {
    //             continue;
    //         }

    //         // linkEl = figureEl.children[0]; // <a> element
    //         var src = figureEl.getAttribute('src');
    //         var srcs = src.split('/');
    //         var srcNoPath = srcs[srcs.length-1];
    //         var smallImageValues = srcNoPath.split('_');

    //         var alt = figureEl.getAttribute('alt');
    //         var largeImageValues = alt.split('_');
            
    //         var baseName = smallImageValues[0]

    //         var smallSize = smallImageValues[1].split('.')[0].split('x');
    //         var smallSizeX = parseInt(smallSize[0], 10)
    //         var smallSizeY = parseInt(smallSize[1], 10)

    //         var largeSize = largeImageValues[1].split('.')[0].split('x');
    //         var largeSizeX = parseInt(largeSize[0], 10)
    //         var largeSizeY = parseInt(largeSize[1], 10)
            
    //         // create slide object
    //         item = {

    //             mediumImage: {
    //                 src: src,
    //                 w: smallSizeX,
    //                 h: smallSizeY
    //             },
    //             originalImage: {
    //                 src: alt,
    //                 w: largeSizeX,
    //                 h: largeSizeY
    //             },
    //             // msrc: figureEl.getAttribute('alt'),
    //             // src: figureEl.getAttribute('href') + alt,
    //             // w: sizeX,
    //             // h: sizeY,
    //             el: figureEl  // save link to element for getThumbBoundsFn
    //         };

    //         items.push(item);
    //     }

    //     return items;
    // };

     var parseThumbnailElements = function(el) {

        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if(figureEl.nodeType !== 1 || figureEl.tagName.toUpperCase() != galleryItemType) {
                continue;
            }

            linkEl = closestChildren(figureEl, function(el){ return el.tagName && el.tagName.toUpperCase() == 'A'}); // <a> element

            var img = null
            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                img = linkEl.children[0];
            } 

            // find the size of the image: 
            // 1. small size: look in the src attribute of <img> find imageName-WIDTHxHEIGHT.ext
            // 2. large size: look in the href attribute of the parent <a> find imageName-WIDTHxHEIGHT.ext

            const regexSmall = /[-_](\d+)x(\d+)\.(\w+)$/;

            let src = img.src;
            let caption = img.alt;
            let href = linkEl.href;

            let smallWidth = null
            let smallHeight = null
            let largeWidth = null
            let largeHeight = null

            let m = null
            if ((m = regexSmall.exec(src)) !== null) {
                smallWidth = parseInt(m[1]);
                smallHeight = parseInt(m[2]);
                let ext = m[3];
            }


            const regexLarge = /[-_](\d+)x(\d+)(-(\d+))?\.(\w+)$/;

            if ((m = regexLarge.exec(href)) !== null) {
                largeWidth = parseInt(m[1]);
                largeHeight = parseInt(m[2]);
                let ext = m[5];
            }

            console.log('image: ' + src)
            console.log('   small size: ' + smallWidth + 'x' + smallHeight)
            console.log('   large size: ' + largeWidth + 'x' + largeHeight)

            // create slide object
            item = {

                mediumImage: {
                    src: src,
                    w: smallWidth,
                    h: smallHeight
                },
                originalImage: {
                    src: href,
                    w: largeWidth,
                    h: largeHeight
                },
                title: caption,
                src: href,
                msrc: src,
                w: largeWidth,
                h: largeHeight,
                el: figureEl  // save link to element for getThumbBoundsFn
            };

            items.push(item);
        }

        return items;
    };


    // find nearest parent element
    var closestParent = function closestParent(el, fn) {
        return el && ( fn(el) ? el : closestParent(el.parentNode, fn) );
    };

    var closestChildren = function closestChildren(el, fn) {
        if(el && fn(el)) {
            return el;
        } else {
            for(let child of el.children) {
                let result = closestChildren(child, fn)
                if(result != null) {
                    return result;
                }
            }
        }
        return null;
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;
        // console.log("eTarget");
        // console.log(eTarget);
        // find root element of slide
        var clickedListItem = closestParent(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === galleryItemType);
        });

        if(!clickedListItem) {
            return;
        }
        // console.log("clickedListItem");
        // console.log(clickedListItem);
        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedGallery.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;
        
        // console.log("clickedGallery");
        // console.log(clickedGallery);

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1 || childNodes[i].tagName.toUpperCase() != galleryItemType) { 
                continue; 
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery, false );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info

                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // console.log("openPhotoSwipe")
        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
                
        }
        options.showHideOpacity = true;
        // options.showAnimationDuration = 0;
        // options.hideAnimationDuration = 0;

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);


        // create variable that will store real size of viewport
        var realViewportWidth,
            useLargeImages = false,
            firstResize = true,
            imageSrcWillChange;

        // beforeResize event fires each time size of gallery viewport updates
        gallery.listen('beforeResize', function() {
            // gallery.viewportSize.x - width of PhotoSwipe viewport
            // gallery.viewportSize.y - height of PhotoSwipe viewport
            // window.devicePixelRatio - ratio between physical pixels and device independent pixels (Number)
            //                          1 (regular display), 2 (@2x, retina) ...


            // calculate real pixels when size changes
            realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio;

            // Code below is needed if you want image to switch dynamically on window.resize

            // Find out if current images need to be changed
            if(useLargeImages && realViewportWidth < 1000) {
                useLargeImages = false;
                imageSrcWillChange = true;
            } else if(!useLargeImages && realViewportWidth >= 1000) {
                useLargeImages = true;
                imageSrcWillChange = true;
            }

            // Invalidate items only when source is changed and when it's not the first update
            if(imageSrcWillChange && !firstResize) {
                // invalidateCurrItems sets a flag on slides that are in DOM,
                // which will force update of content (image) on window.resize.
                gallery.invalidateCurrItems();
            }

            if(firstResize) {
                firstResize = false;
            }

            imageSrcWillChange = false;
            // console.log("beforeResize")

        });


        // gettingData event fires each time PhotoSwipe retrieves image source & size
        gallery.listen('gettingData', function(index, item) {

            // Set image source & size based on real viewport width
            if( useLargeImages ) {
                item.src = item.originalImage.src;
                item.w = item.originalImage.w;
                item.h = item.originalImage.h;
            } else {
                item.src = item.mediumImage.src;
                item.w = item.mediumImage.w;
                item.h = item.mediumImage.h;
            }
            // console.log("gettingData: " + item.src)

            // It doesn't really matter what will you do here, 
            // as long as item.src, item.w and item.h have valid values.
            // 
            // Just avoid http requests in this listener, as it fires quite often

        });

        // console.log("gallery.init()")
        // Note that init() method is called after gettingData event is bound
        gallery.init();
    };

    
    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

// execute above function


// see instructions at the top of the file
initPhotoSwipeFromDOM('.gallery', 'DL');