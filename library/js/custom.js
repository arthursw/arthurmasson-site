/**
 */

 /*globals jQuery, document */
 (function ($) {
	"use strict";


	$(document).ready(function(){

	// 	let updateDate = function() {
	// 		let lang = localStorage.getItem('language')
	// 		moment.locale(lang == 'french' ? 'fr' : 'en');
	// 		$('.post-date').each(function(i, date) {
	// 			var $date = $(date);
	// 			$date.html(
	// 				moment($date.attr('datetime'))
	// 				.format(lang == 'french' ? 'MMMM YYYY' : 'MMMM YYYY')
	// 				);
	// 		});
	// 	}
	// 	updateDate();

	// 	let translate = function(to) {

	// 		let from = to == 'english' ? 'french' : 'english';

	// 		localStorage.setItem('language', to);
	// 		updateDate();

	// 		let lang = to == 'english' ? 'en' : 'fr'
	// 		window.location.hash = "lang=" + lang;
	// 		document.documentElement.className = "lang-" + lang + " js";

	// 		// Hide other language
	// 		if(to == 'english') {
	// 			$("#franais").nextUntil("#english").hide()
	// 			$("#english").nextUntil("#franais").show()
	// 		} else if(to == 'french') {
	// 			$("#english").nextUntil("#franais").hide()
	// 			$("#franais").nextUntil("#english").show()
	// 		}
	// 		// Hide language titles
	// 		$("#franais, #english").hide()


	// 		$("["+from+"]").each(function() {
	// 			$(this).html($(this).html().replace($(this).attr(from), $(this).attr(to)))
	// 		})


	// 		let translateTitle = function() {

	// 			$(this).addClass('translated')
	// 			this.addEventListener("transitionend", function(event) { $(this).addClass('noTransition') }, true);

	// 			if($(this).attr("english-french") == null) {
	// 				$(this).attr("english-french", $(this).text())
	// 			}

	// 			let languages = $(this).attr("english-french").split('|')

	// 			if(languages.length>1) {
	// 				$(this).text(to=="french" ? languages[0] : languages[1])
	// 			}
	// 		}

	// 		$(".preview .post-title a").each(translateTitle)
	// 		$("h1.post-title").each(translateTitle)

	// 		// Opacity transition of entire articles to avoid blink
	// 		$("article.post").addClass('translated')
	// 	}

	// 	let language = localStorage.getItem('language')
	// 	translate(language)

	// 	let linkJ = $('<a>').text(language == 'french' ? 'English' : 'Français').attr('href', '')
	// 	let menuItemJ = $('<li>').addClass(language == 'french' ? 'nav-english' : 'nav-french').append(linkJ)

	// 	linkJ.click(function(event){

	// 		parent = $(event.target).parent();

	// 		if(parent.hasClass("nav-english")) {
	// 			parent.removeClass("nav-english").addClass("nav-french").find("a").text("Français");
	// 			translate('english');
	// 		} else if(parent.hasClass("nav-french")) {
	// 			parent.removeClass("nav-french").addClass("nav-english").find("a").text("English");
	// 			translate('french');
	// 		}

	// 		event.preventDefault();
	// 		event.stopImmediatePropagation();
	// 		event.stopPropagation();
	// 		return true;
	// 	})

	// 	$("#site-head .nav").append(menuItemJ)

	// 	setTimeout(function(){ menuItemJ.addClass('translated') }, 0)

		// put content in an inner div

		// let headerJ = $("div.header.center")
		// $("article.post header").before(headerJ)


		// let galleryJs = $(".gallery")
		// // for(let gallery of galleryJs) {
  //   galleryJs.each( (index, gallery)=> {
		// 	let galleryJ = $(gallery);

		// 	// create gallery:

		// 	// get item classes
		// 	// let classes = galleryJ.attr('itemclasses');
		// 	let largeImageSize = galleryJ.attr('largeimagesize');
		// 	let largeImageSizeDefined = false;
		// 	if(largeImageSize != null) {
		// 		largeImageSize = largeImageSize.split('x');
		// 		if(largeImageSize.length == 2) {
		// 			largeImageSizeDefined = true;
		// 		}
		// 	}

		// 	let smallImageSize = galleryJ.attr('smallimagesize');
		// 	let smallImageSizeDefined = false;
		// 	if(smallImageSize != null) {
		// 		smallImageSize = smallImageSize.split('x');
		// 	}


		// 	// let containerJ = $("<div>");
		// 	// containerJ.addClass('row')

  //     // put all img into a linking to the large version of the image
		// 	// add all item classes to the a item
		// 	let images = galleryJ.find("img");

		// 	// for(let img of images) {
  //     images.each( (index, img)=> {
		// 		let imgJ = $(img);
		// 		// let aJ = $('<a>');
		// 		// aJ.append(imgJ);
		// 		// aJ.addClass(classes);
		// 		// containerJ.append(aJ);

  //       // aJ.attr('href', img.src.replace(/.jpg$/, '_large.jpg'));

		// 		imgJ.load( () => {
		// 			let imgWidth = img.naturalWidth;
		// 			let imgHeight = img.naturalHeight;
		// 			//initializeImage(this, this.width, this.height, imgJ, aJ);
		// 			// console.log("initializeImage: " + img.src)
		// 			// console.log("initializeImage: " + imgWidth + ", " + imgHeight)
		// 			imgJ.attr('imagesize', '' + (smallImageSizeDefined ? smallImageSize[0] : imgWidth) + 'x' + (smallImageSizeDefined ? smallImageSize[1] : imgHeight));
		// 			// aJ.attr('imagesize', '' + (largeImageSizeDefined ? smallImageSize[0] : 2 * imgWidth) + 'x' + (largeImageSizeDefined ? smallImageSize[1] : 2 * imgHeight));
		// 			// aJ.attr('href', img.src.replace(/.jpg$/, '_large.jpg'));
		// 		});
		// 		imgJ.load();

		// 		// if (!img.complete) {
		// 		// 	console.log("not yet loaded: " + img.src)

		// 		// } else {
		// 		// 	console.log("already loaded:" + img.src)
		// 		// 	initializeImage(img, imgJ, aJ, true);
		// 		// }
		// 	})
		// 	// galleryJ.append(containerJ);
		// })



		// let divJ = $("<div>")
		// divJ.addClass('col-lg-4')

		// let galleryJ = $(".gallery")
		// galleryJ.addClass('col-lg-8')

		// let contentJ = galleryJ.nextAll()
		// galleryJ.after(divJ)
		// divJ.append(contentJ)

		// Hide other language:
		// let language = QueryString.lang;

		// let otherLang = lang == "fr" ? "en" : "fr";


			// On the home page, move the blog icon inside the header
			// for better relative/absolute positioning.

			//$("#blog-logo").prependTo("#site-head-content");


		// Remove pagination if there is no need to display it (if there is only one page)

		// let paginationJ = $("nav.pagination")
		// if(paginationJ.children().length <= 1) {
		// 	paginationJ.hide()
		// }

		// $('.gallery').masonry({
		// 	// options
		// 	itemSelector: '.gallery-item',
		// 	columnWidth: 1
		// });

		let footerCategoryJ = $('.footer-category')

		footerCategoryJ.each( function() {
			console.log(this)
			console.log($(this).children().length)
			let nChildren = $(this).children().length
			if(nChildren < 1 || $(this).find("a:contains('Non classé')").length > 0) {
				$(this).parent().hide()
			}
		})


		footerCategoryJ.find("a:contains('Non classé')").hide()

		// Change style button:

		let changeStyleBtnJ = $(".nav-changer-de-style")
		let siteURL = $("#screen-styles").attr('data-site-url')
		window.IDLVStyleIndex = 0
		let nStyles = 2
		changeStyleBtnJ.click(function(event) {
			window.IDLVStyleIndex++
			if(window.IDLVStyleIndex >= nStyles) {
				window.IDLVStyleIndex = 0
			}
			if(window.IDLVStyleIndex == 0) {
				$("#screen-styles").attr('href', siteURL + "/assets/css/screen.css")
			} else if(window.IDLVStyleIndex == 1) {
				$("#screen-styles").attr('href', siteURL + "/assets/css/screen2.css")
			}
			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
			return true;
		})
	});

}(jQuery));
