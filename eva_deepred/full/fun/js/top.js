/*
******************************************************************
* MJP top.js
******************************************************************
*/

var UaInfo = (function(){
	var that = {};
	var userAgent = window.navigator.userAgent.toLowerCase();
	var appVersion = window.navigator.appVersion.toLowerCase();
	that.browser;
	that.os;
	that.ieVr;
	that.interface;

	if(userAgent.indexOf('iphone') > 0 || userAgent.indexOf('ipod') > 0) {
		that.os = 'iPhone';
		that.interface = 'touch';
	}else if(userAgent.indexOf('ipad') > 0) {
		that.os = 'iPad';
		that.interface = 'touch';
	}else if(userAgent.indexOf('android') > 0) {
		if(userAgent.indexOf('mobile') > 0) {
			that.os = 'Android';
		}else{
			that.os = 'AndroidTab';
		}
		that.interface = 'touch';
	}else if(userAgent.match(/mac|ppc/)) {
		that.os = 'mac';
		that.interface = 'mouse';
	}else{
		that.os = 'other';
		that.interface = 'mouse';
	}

	if(userAgent.indexOf('msie') != -1) {
		that.browser = 'ie';
		if(appVersion.indexOf('msie 8.') != -1) {
			that.ieVr = 8;
		}else if(appVersion.indexOf('msie 9.') != -1) {
			that.ieVr = 9;
		}else if(appVersion.indexOf('msie 10.') != -1) {
			that.ieVr = 10;
		}
	}else if(appVersion.indexOf("trident/7.0") > -1) {
		that.browser = 'ie';
		that.ieVr = 11;
	}else if(userAgent.indexOf('chrome') != -1) {
		that.browser = 'chrome';
	}else if(userAgent.indexOf('safari') != -1) {
		that.browser = 'safari';
	}else if(userAgent.indexOf('firefox') != -1) {
		that.browser = 'firefox';
	};
	return that;
})();


(function($){
	GUNDOM_SHAR = {};
	GUNDOM_SHAR.TOP = {
		init:function(){
			$('body').addClass('loading');
			$('body img').EleSurveillance({
				'callback_class' : 'js_SurveEnd',//監視終了時にbodyへ付与するclass名
				'watch_level': 50,//50監視レベル
				'watch_interval': 50,//50監視実行間隔
				'time_limit': 2000//2000制限時間
			});
			var start_flg = 0;
			var interval_value = 100;
			var _update = setInterval(function(){
				start_flg++;
				if($('body').hasClass('js_SurveEnd')){
					if(start_flg>20){//監視完了後1秒後(10*100=1000ms)に発火
						clearInterval(_update);
						$('body').removeClass('js_SurveEnd');
						GUNDOM_SHAR.TOP.complete();
					}
				}
			}, interval_value);

			GUNDOM_SHAR.TOP.loadingAction();
			// GUNDOM_SHAR.TOP.uaInfoJudg();
			GUNDOM_SHAR.TOP.setBtnPromotion();
		},
		complete:function(){
			GUNDOM_SHAR.TOP.start();
			$('body').removeClass('loading');
			$('#loading').delay(0).fadeOut(1000,function(){
				$('#loading').remove();
			});
		},
		start:function(){
			setTimeout(function(){
				$('#wrp-all').addClass('action');
				setTimeout(function(){
					$('#wrp-all').toggleClass('action-end');
				},5200);
			}, 300);
		},
		uaInfoJudg:function(){
			if (UaInfo.interface == 'touch'){
				//SP環境の場合
				$('body').addClass('device-sp');
				if (UaInfo.os == 'iPad') {
					$('body').addClass('device-iPad');
				}
				if (UaInfo.os == 'Android') {
					$('body').addClass('device-android');
				}
				if (UaInfo.os == 'iPhone') {
					$('body').addClass('device-iPhone');
				}
			}
			if (UaInfo.os == 'iPad') {
				$('body').addClass('device-iPad');
			}
			if (UaInfo.os == 'Android') {
				$('body').addClass('device-android');
			}
			if (UaInfo.os == 'iPhone') {
				$('body').addClass('device-iPhone');
			}
			else{
				//PC環境の場合
				$('body').addClass('device-pc');
			}
			// if (UaInfo.os == 'ipad' && UaInfo.interface == 'touch') {
			// 	$('body').addClass('device-ipad');
			// }
			// if (UaInfo.os == 'Android' && UaInfo.interface == 'touch') {
			// 	$('body').addClass('device-android');
			// }
			// if (UaInfo.os == 'iPhone' && UaInfo.interface == 'touch') {
			// 	$('body').addClass('device-iPhone');
			// }
			// if(UaInfo.os == 'mac' && UaInfo.browser == 'firefox'){
			// 	$('body').addClass('os-mac browser-firefox');
			// }

			//iphone5(IOS7版用)
			var ua = window.navigator.userAgent.toLowerCase();
			if(navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('7_') > 0){
				if(ua.indexOf('safari') != -1){
					$('body').addClass('iPhone-ios7');
					GUNDOM_SHAR.TOP.vwCal();
				}
			}
		},
		loadingAction:function(){
			function action(){
				
			}
		},
		setBtnPromotion:function(){
			var $btn = $('#wrp-all .promotion-inner');

			if($btn.is('[data-video-id]')){
				// データ属性値[data-video-id]が設定されていた場合はyoutube動画を再生
				$btn.modalVideo();
			}else{
				// データ属性値[data-video-id]が設定されていない場合はmp4動画を再生
				$btn.on('click', function(e){
					$(this).addClass('js-movie-play');
					e.preventDefault();
					MJP.movieModal.show({
						video: './mov/movie.mp4',
						poster: '',
						gaid: 'Full_Promotion_movie',
						gapath : '/mov/promotion'
					});
				});

				MJP.initMovie({
					path: './'
				});
			}
			// $(document).ready('#mdl-plr',function() {
			// 	var change_flg = 0;
			// 	$(window).resize(function(event) {
			// 		var btn_hegiht_adj = $('#mdl-plr').height() / 2;
			// 		var modal_height_half = $('#mdl-box').height() / 2;
			// 		console.log(btn_hegiht_adj);
			// 		$('.btn').css('top',modal_height_half - btn_hegiht_adj- 5);
			// 		change_flg = 1;
			// 	});
			// 	if(change_flg > 0) {
			// 		var btn_hegiht_adj = $('#mdl-plr').height() / 2;
			// 		var modal_height_half = $('#mdl-box').height() / 2;
			// 		console.log(btn_hegiht_adj);
			// 		$('.btn').css('top',modal_height_half - btn_hegiht_adj- 5);
			// 	}
			// 	else {
			// 		change_flg = 0;
			// 	}
			// });
						// var btn_hegiht_adj = $('#mdl-plr').height() / 2;
						// var modal_height_half = $('#mdl-box').height() / 2;
						// console.log(btn_hegiht_adj);
						// $('.btn').css('top',(modal_height_half - btn_hegiht_adj) - 5);
		},
		setSnsBtn:function(){
			!function(d,s,id){
				var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
				if(!d.getElementById(id)){
					js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);
				}
			}(document, 'script', 'twitter-wjs');
		},
		smoothScroll:function(){
			$(document).on('click','a[href^="#"]',function(){
				var speed = 500;
				var href= $(this).attr('href');
				var nav_h = window.matchMedia('(min-width: 768px)').matches? $('#nav').outerHeight() : 0;
				var target = href == '#top'? $('body') : $(href == "#" || href == "" ? 'html' : href);
				var position = target.offset().top;
				if(window.matchMedia('(max-width: 767px)').matches && $(this).parent().hasClass('nav_item')){
					$('#nav').removeClass('nav_open');
					$('.nav_bg').stop().fadeOut();
					$('.nav_list_box').stop().fadeOut();
				}
				$('html, body').animate({scrollTop:position-nav_h}, speed, 'swing');
				return false;
			});
		},
		parallax: function(){
			function action(){
				var winHei = window.innerHeight;
				var scrAmount = $(window).scrollTop();
				var target = $('.animation');
				target.each(function(){
					var targetTop = $(this).offset().top;
					if((scrAmount + (winHei - 100)) > targetTop) {
						$(this).addClass('animated');
					}else {
						$(this).removeClass('animated');
					}
				});
			}
			action();

			$(window).on('scroll', function(e){
				action();
			});
		},
		menu_madal: function(){
			$('.js-target_modal').on('click', function(e){
				// $('.modal-base').addClass('animated');
				$('.modal-base').fadeIn(300);
				$('.sub-menu').css('display','block');
				$('.js-acodion-btn').addClass('js-acodion-active');
			});
			$('.js-target_modal-close,a,.modal-base').on('click', function(e){
				// $('.modal-base').removeClass('animated');
				$('.modal-base').fadeOut(300);
			});
			$('.js-acodion-btn').on('click', function(e){
				e.stopPropagation();
				$(this).toggleClass('js-acodion-active');
				$('.sub-menu').stop().slideToggle(300);
			});
			$('.menu-list li > img').on('click', function(e){
				e.stopPropagation();
			});
		},
		fixed_menu: function(){
			function action(){
				var winHei = window.innerHeight;
				var scrAmount = $(window).scrollTop();
				var target = $('.js-fixed-judge');
				target.each(function(){
					var targetTop = $(this).offset().top;
					if(scrAmount > targetTop) {
						$('.fixed-menu').fadeIn(300);
					}else {
						$('.fixed-menu').fadeOut(300);
					}
				});
			}
			action();

			$(window).on('scroll', function(e){
				action();
			});
		},
		vwCal:function(){
			//指定したいvw値を設定（heightプロパティに46vw指定したい場合）
			//$('●●●').vwCal({'data_vw': '46','data_pp':'height'});
			$.fn.vwCal = function($plug) {
				var $adj_default = {
					data_vw: 'auto',
					data_pp: ''
				};
				$.extend($adj_default , $plug);

				var adj_val = $adj_default.taget_parent == '' || $adj_default.data_vw == 'auto' ? 'auto' : calculation($adj_default.data_vw);
				var adj_pp = $adj_default.data_pp;
				function calculation(target){
					var window_w = $(window).width()/100;
					var target_val = target;
					var calculation_val = window_w * target_val;
					return calculation_val;
				}
				$(this).css(adj_pp,adj_val);
			};

			function action() {
			}

			if(window.matchMedia('(max-width: 767px)')){
				action();
			}
			$(window).on('resize',function(){
				if(window.matchMedia('(max-width: 767px)')){
					action();
				}
			});
		}
	}
	GUNDOM_SHAR.TOP.init();
	$(window).on('load',function(){
		GUNDOM_SHAR.TOP.uaInfoJudg();
		GUNDOM_SHAR.TOP.init();
		GUNDOM_SHAR.TOP.smoothScroll();
		GUNDOM_SHAR.TOP.parallax();
		GUNDOM_SHAR.TOP.menu_madal();
		// GUNDOM_SHAR.TOP.fixed_menu();
		GUNDOM_SHAR.TOP.setSnsBtn();
	});
})(jQuery);