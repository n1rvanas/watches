$(function() {
    M1.init();
    $(window).resize(function() {
        M1.modalRefresh();
    });
    M1.modalRefresh();
    $(document).on("click", ".m1modal", function(event) {
        if (event.target != this) {
            return false;
        } else {
            M1.modalHide($(this).closest(".m1modal"));
        }
    }).on("click", ".icon-close", function(event) {
        if (event.target != this) {
            return false;
        } else {
            M1.modalHide($(this).closest(".m1modal"));
        }
    }).on("keydown", function(key) {
        if (key.keyCode == 27) {
            M1.modalHide($(".m1modal:visible:last"));
        }
    }).on("click", ".m1modal > *", function(event) {
        event.stopPropagation();
        return true;
    });
});
var M1 = (function($, $n) {
    return $.extend($n, {
        init: function() {
            var current = this;
        },
        modalHide: function($modal) {
            $modal.fadeOut("fast", function() {
                if (!$(".m1modal:visible").length) {
                    $("body").removeClass("m1modal-show");
                }
            });
        },
        modalRefresh: function() {
            if ($(".m1modal:visible:last").length) {
                var modalBlock = $(".m1modal:visible:last .m1modal-block"),
                    width = parseInt(modalBlock.width()),
                    height = parseInt(modalBlock.height());
                if ($(window).height() > height + 20) {
                    modalBlock.addClass("m1modal-top").removeClass("margin-t-b").css("margin-top", -1 * (height / 2));
                } else {
                    modalBlock.addClass("margin-t-b").removeClass("m1modal-top");
                }
                if ($(window).width() > width) {
                    modalBlock.addClass("m1modal-left").removeClass("margin-l").css("margin-left", -1 * (width / 2));
                } else {
                    modalBlock.addClass("margin-l").removeClass("m1modal-left");
                }
            }
        },
        modalShow: function($modal) {
            $modal.fadeIn("fast");
            $("body").addClass("m1modal-show");
            this.modalRefresh();
        },
        initComebacker: function(timeout) {
            try {
                setTimeout(function start_M1comebacker() {
                    var comebacker = true;
                    $(window).on("mouseout", function(event) {
                        if (event.pageY - $(window).scrollTop() < 1 && comebacker) {
                            comebacker = false;
                            var modalWindow = $("#m1-form");
                            M1.modalShow(modalWindow);
                            return false;
                        }
                    });
                }, timeout);
            } catch (e) {}
        },
        validateAndSendForm: function(jsonRequest, M1Text) {
            var current = this;
            $("#m1-form form").on("submit", function() {
                if (jsonRequest) {
                    current.prepareJsonData($(this));
                }
                $("input[name=name]", this).val($.trim($("input[name=name]", this).val()));
                if (!$("input[name=name]", this).val()) {
                    alert(M1Text.validation_name);
                    return false;
                }
                var phone_val = $("input[name=phone]", this).val();
                var is_popup = $("input[name=is_popup]", this).val();
                var reg1 = new RegExp("[^0-9]*", "g"),
                    reg2 = new RegExp("[^0-9-+ ()]", "g");
                var phone_txt = phone_val.replace(reg1, "");
                if (phone_val.search(reg2) != -1) {
                    alert(M1Text.validation_phone1);
                    return false;
                }
                if (!phone_txt || phone_txt.length < 7) {
                    alert(M1Text.validation_phone2);
                    return false;
                }
                current.showComebackerAlert = false;
                return true;
            });
        },
        prepareJsonData: function(form) {
            var datarow = form.serializeArray();
            $(datarow).each(function(item, itemData) {
                if (itemData.name == "name" || itemData.name == "phone" || itemData.name == "is_popup") {
                    delete datarow[item];
                }
            });
        },
        showComebackerAlert: true,
        initComebackerAlert: function(M1Text) {
            var current = this;
            window.onbeforeunload = function(evt) {
                if (current.showComebackerAlert) {
                    current.showComebackerAlert = false;
                    return M1Text.comebacker_text;
                }
            };
        }
    });
})(jQuery, M1 || {});
