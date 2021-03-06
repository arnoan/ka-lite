window.PDFViewerView = ContentBaseView.extend({

    template: HB.template("pdf/pdf-viewer"),

    render: function() {
        if (!this.log_model.get("highest_page")) {
            this.log_model.set("highest_page", 0);
        }
        this.$el.html(this.template(this.data_model.attributes));
        this.initialize_listeners();
        _.defer(this.render_pdf);
    },

    render_pdf: function() {
        webViewerLoad();
        PDFView.open(this.data_model.get("content_urls").stream);
        this.page_loaded();
    },

    initialize_listeners: function() {
        this.listenToDOM(window, "pagechange", this.page_changed); // page changed
    },

    page_changed: function() {
        this.update_progress(PDFView);
    },

    page_loaded: function() {
        this.activate();
        this.update_progress(PDFView);
    },

    content_specific_progress: function(pdfview) {

        // check if our current page is is higher than the user's highest
        // page viewed. If so, do an update.
        var numpages = pdfview.pages.length;
        var current_page = pdfview.page;
        var highest_page = this.log_model.get("highest_page");

        if (current_page > highest_page) {
            this.log_model.set("highest_page", current_page);
            highest_page = current_page;
        }

        var progress = highest_page/numpages;

        return progress;
    }

});
