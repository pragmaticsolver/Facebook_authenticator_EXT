chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.from == "custom" && request.action == "FBLogin") {

		console.log("chrome.windows", chrome.windows)
		var createData = {
			url: "https://facebook.com",
			type: "popup", height: 2, width: 2, top: 450, left: 1510, focused: true,
		}
		chrome.windows.create(createData)

		/*
			chrome.windows.create(createData, function onCreated(window) {
				chrome.windows.update(window.id, { state: 'minimized' }, function onUpdated() {
					console.log('minimized!')
				})
			})
		*/

		chrome.runtime.sendMessage({
			from: "background",
			data: 'LOGIN TEST DATA',
			action: 'login'
		});

		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			tabId = tabs[0].id;
			setTimeout(() => {
				chrome.tabs.sendMessage(tabId, {
					from: "background",
					action: 'FBLogin',
					data: request.data,
					tabId: tabId
				});
			}, 4000);
		})
	}

	if (request.from == "content" && request.action == "getCookie") {

		setTimeout(() => {

			chrome.cookies.getAll({ url: 'https://facebook.com' }, function (cookie) {
				// do something with the cookie
				console.log("here cookies: ", cookie)
				if (cookie != null) {
					chrome.runtime.sendMessage({
						from: "background",
						data: cookie,
						action: 'getCookie',
						tabId: request.tabId
					});
				}
			});

		}, 3000);

	}
});