describe("hyperscript integration", function() {
    beforeEach(function () {
        this.server = makeServer();
        clearWorkArea();
    });
    afterEach(function () {
        this.server.restore();
        clearWorkArea();
    });

    it('can trigger with a custom event', function () {
        this.server.respondWith("GET", "/test", "Custom Event Sent!");
        var btn = make('<button _="on click send customEvent" hx-trigger="customEvent" hx-get="/test">Click Me!</button>')
        btn.click();
        this.server.respond();
        btn.innerHTML.should.equal("Custom Event Sent!");
    });

    it('can handle htmx driven events', function () {
        this.server.respondWith("GET", "/test", "Clicked!");
        var btn = make('<button _="on htmx:afterSettle add .afterSettle" hx-get="/test">Click Me!</button>')
        btn.classList.contains("afterSettle").should.equal(false);
        btn.click();
        this.server.respond();
        btn.classList.contains("afterSettle").should.equal(true);
    });

    it('can handle htmx error events', function () {
        this.server.respondWith("GET", "/test", [404, {}, "Bad request"]);
        var div = make('<div id="d1"></div>')
        var btn = make('<button _="on htmx:error(errorInfo) put errorInfo.error into #d1.innerHTML" hx-get="/test">Click Me!</button>')
        btn.click();
        this.server.respond();
        div.innerHTML.should.equal("Response Status Error Code 404 from /test");
    });

});