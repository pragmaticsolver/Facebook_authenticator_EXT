var tabId = ''
$(document).ready(function () {

    chrome.storage.local.get({ _email: null, _password: null, _tabid: null, logoutFlag: false, initialFlag: true }, function (items) {
        const logoutFlag = items.logoutFlag
        const _email = items._email
        const _password = items._password
        const _tabid = items._tabid
        console.log("logoutFlag: ", logoutFlag)
        const email_elm = $('#email');
        const pwd_elm = $('#pass');
        const login_btn_elm = $('button[name="login"]')[0]
        const initialFlag = items.initialFlag
        chrome.storage.local.set({ initialFlag: true })

        if (logoutFlag && email_elm.length != 0 && pwd_elm.length != 0 && login_btn_elm.length != 0 && initialFlag) {

            chrome.storage.local.set({ initialFlag: false })
            email_elm.val(_email)
            pwd_elm.val(_password)
            login_btn_elm.click();

            chrome.runtime.sendMessage({
                from: "content",
                data: 'testCookie',
                action: 'getCookie',
                tabId: _tabid
            });

        }
    })

});

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.action == "FBLogin") {

        console.log("listening from back")
        setTimeout(() => {

            const email = msg.data.email;
            const password = msg.data.password;
            const email_elm = $('#email');
            const pwd_elm = $('#pass');
            const login_btn_elm = $('button[name="login"]')[0]
            tabId = msg.tabId;

            chrome.storage.local.set({ _email: email })
            chrome.storage.local.set({ _password: password })
            chrome.storage.local.set({ _tabid: tabId })
            chrome.storage.local.set({ initialFlag: true })

            if (email_elm.length != 0) {

                chrome.storage.local.set({ logoutFlag: false })
                email_elm.val(email)
                pwd_elm.val(password)
                login_btn_elm.click();

                chrome.runtime.sendMessage({
                    from: "content",
                    data: 'testCookie',
                    action: 'getCookie',
                    tabId: tabId
                });

            } else {

                console.log("no!")
                chrome.storage.local.set({ logoutFlag: true })
                const account_elm = $("div[aria-label=Account]")[0];
                account_elm.click();

                setTimeout(() => {

                    const logout_elm = $("span:contains('Log Out')")[0]

                    console.log("logout: ", logout_elm)
                    logout_elm.click();
                }, 1000)

            }

        }, 3000);

    }
})
