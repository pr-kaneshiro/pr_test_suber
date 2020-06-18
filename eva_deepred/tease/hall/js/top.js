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
	EVA_DEEPRED = {};
	EVA_DEEPRED.TOP = {
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
					//EVA_DEEPRED.TOP.start();
					if(start_flg>10){//監視完了後1秒後(10*100=1000ms)に発火
						clearInterval(_update);
						$('body').removeClass('js_SurveEnd');
						EVA_DEEPRED.TOP.complete();
						//EVA_DEEPRED.TOP.start();
					}
				}
			}, interval_value);

			EVA_DEEPRED.TOP.loadingAction();
			// EVA_DEEPRED.TOP.uaInfoJudg();
			EVA_DEEPRED.TOP.setBtnPromotion();
		},
		complete:function(){
			EVA_DEEPRED.TOP.loading_animetion_set();
			setTimeout(function(){
				$('#loading').delay(0).fadeOut(1000,function(){
					$('body').removeClass('loading');
					$('#loading').remove();
					EVA_DEEPRED.TOP.start();
				});
			},1800);//XX秒の遅延 最初のloadingとタイミングを合わせる
			// $('#loading').delay(0).fadeOut(1000,function(){
			// 	$('#loading').remove();
			// });
		},
		start:function(){
			setTimeout(function(){
				//アニメーション開始
				$('#wrp-all').addClass('action');
				setTimeout(function(){
					$('#wrp-all').toggleClass('action-end');
					//アニメーションをすべてJSで動作させる場合　させない場合コメント化
					// $('#loading').delay(0).fadeOut(1000,function(){
					// 	$('#loading').remove();
					// });
				},2000);//2.3秒の遅延
			}, 300);
		},
		loading_animetion_set:function(){
			var EVALOAD = {};
			EVALOAD.lists 	= $('img, video').not('.not_list');
			EVALOAD.length 	= EVALOAD.lists.length;
			EVALOAD.loaded 	= 0;
			EVALOAD.wrap 	= $('.loading_wrap');
			EVALOAD.main 	= $('.loading', EVALOAD.wrap);
			EVALOAD.message = $('.message', EVALOAD.wrap);
			EVALOAD.bar 	= $('.bar', EVALOAD.wrap);

			// 初期化
			EVALOAD.init = function(){

				// メッセージ「読込中」表示
				EVALOAD.main.addClass('EVALOAD_start');
				// 読み込む要素の処理
				var count = 0;

				EVALOAD.anime('on');
				EVALOAD.update();
				EVALOAD.finish();

				// var countup = function(){
    // 			console.log(count++);
    // 		}
    // 		EVALOAD.anime('on');
			 //  var id = setInterval(function(){
			 //  	countup();
			 //  	EVALOAD.update();
		  //   if(count > 2) {　
		  //   	EVALOAD.update();
		  //   	EVALOAD.finish();
		  //     return false;
		  //   }}, 100);

			  //clearInterval(id);　//idをclearIntervalで指定している

				// if(EVALOAD.lists.length == 0){
				// 	EVALOAD.finish();
				// }else{
				// 	EVALOAD.lists.each(function(){
				// 		//EVALOAD.update();
				// 		var that = $(this), url = "";
				// 		url = that.attr('src');
				// 		that.attr('src', '');
				// 		that.attr('src', url)
				// 		that.on('load', function(){
				// 			EVALOAD.update();
				// 			console.log(that);
				// 		});
				// 	});
				// }
				//アニメーション on
				//EVALOAD.anime('on');
			};

			// 更新
			EVALOAD.update = function(el){
				EVALOAD.loaded++;
				console.log(EVALOAD.loaded);
				var progress = Math.floor(EVALOAD.loaded / EVALOAD.length * 100);
				EVALOAD.bar.css({'width' : progress + '%'});
				// 読み込み完了
				if(EVALOAD.loaded == EVALOAD.length){
					EVALOAD.finish();
				}
			};

			// アニメーション
			EVALOAD.anime = function(mode){
				var graph01 = $('.graph01').children(),
					graph02 = $('.graph02').children();
				// アニメーション開始
				if(mode == 'on'){
					EVALOAD.time = setInterval(function(){
						graph01.each(function(){
							$(this).css({'width' : r(250) + 'px'});
						});
						graph02.each(function(){
							var pm = (r(2)) ? 1 : -1;
							$(this).css({'transform' : 'rotate(' +  r(180) * pm + 'deg)'});
						});
					}, 100);
				}

				// アニメーション終了
				if(mode == 'off'){
					clearInterval(EVALOAD.time);
					graph01.each(function(){$(this).css({'width' : '250px'});});
					graph02.each(function(){$(this).css({'transform' : 'rotate(0deg)'});});
				}
				// ランダム数値を返す
				// @param max　:取得したい最大値
				// @return :0～maxまでのランダム値
				function r(max) {
					return Math.floor( Math.random() * max ) ;
				}
			};

			// 最終処理
			EVALOAD.finish = function(){
				setTimeout(function(){
					EVALOAD.main
						.removeClass('EVALOAD_start')
						.addClass('EVALOAD_loaded');
					EVALOAD.bar.css({'width' : '100%'});
					EVALOAD.anime('off');
					//$(window).trigger('EVALOADED');
					// アニメーション
					// EVALOAD.message.velocity(
					// 	{
					// 		opacity: 0,
					// 		scaleY : 0
					// 	},{
					// 		'duration': 100,
					// 		'delay': 500,
					// 		'display': 'none',
					// 		'easing':  'ease-in'
					// 	}
					// );
					// EVALOAD.main.velocity(
					// 	{
					// 		opacity: 0,
					// 		scaleY : 0
					// 	},{
					// 		'duration': 150,
					// 		'delay': 700,
					// 		'display': 'none',
					// 		'easing':  'ease-in'
					// 	}
					// );
				// 	EVALOAD.wrap
				// 		.velocity(
				// 		{
				// 			opacity: 0
				// 		},{
				// 			'duration': 500,
				// 			'delay': 1000,
				// 			'easing':  'ease-in',
				// 			'display': 'none',
				// 			'complete': function(){
				// 				EVALOAD.wrap.remove();
				// 				console.log('lkfslkfjdslf');
				// 				//$(window).trigger('EVALOADEND');
				// 				//$('#wrap').fadeIn(400);
		  //           // $('.chara').delay(1460).queue(function() {
		  //           //     $(this).addClass('move').dequeue();
		  //           //     $(this).attr('src', $(this).attr('src').replace(/_play.gif$/g, '.gif'));
		  //           // });

		  //           // $('.nav_box').delay(1700).queue(function() {
		  //           //     var nav_h = 768;
		  //           //     $(this).animate({
		  //           //         height: nav_h + "px",
		  //           //         opacity: 1,
		  //           //     }, 500 , "easeOutBack").dequeue();
		  //           // });

		  //           // fade_item.delay(2700).queue(function() {
		  //           //     $(this).addClass('item-fade_in').dequeue();
		  //           // });

		  //           // $('.r-box').delay(2700).queue(function() {
		  //           //     $(this).addClass('move').dequeue();
		  //           // });
    //             // $('.mvBtn').delay(3600).fadeIn(500);
				// 				$('.sns_btn').delay(3900).fadeIn(500,function(){
				// 					!function(d,s,id){var
				// js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document,
				// 'script', 'twitter-wjs');
				// 				});
		  //           setTimeout(function(){
		  //               emagency();
		  //           },500);
				// 			}
				// 		}
				// 	);
				}, 1500);//1.5秒後に読み込み完了を表示
			}

			// スタート
			EVALOAD.init();
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
					EVA_DEEPRED.TOP.vwCal();
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
						gaid: 'Teaser_Promotion_movie',
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
			var acodion
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
	EVA_DEEPRED.TOP.init();
	$(window).on('load',function(){
		EVA_DEEPRED.TOP.uaInfoJudg();
		EVA_DEEPRED.TOP.init();
		EVA_DEEPRED.TOP.smoothScroll();
		// EVA_DEEPRED.TOP.parallax();
		// EVA_DEEPRED.TOP.menu_madal();
		// EVA_DEEPRED.TOP.fixed_menu();
		EVA_DEEPRED.TOP.setSnsBtn();
	});
})(jQuery);