wp.domReady(function () {
  wp.hooks.addFilter(
    "blocks.registerBlockType",
    "my-plugin/synchronized-alt-text",
    function (settings, name) {
      if (name === "core/image") {
        settings.attributes.alt.default = "";
      }
      return settings;
    }
  );

  wp.data.subscribe(function () {
    var selectedBlock = wp.data.select("core/block-editor").getSelectedBlock();
    if (selectedBlock && selectedBlock.name === "core/image") {
      var imgId = selectedBlock.attributes.id;
      var currentAlt = selectedBlock.attributes.alt;

      if (imgId) {
        var media = wp.data.select("core").getMedia(imgId);
        if (media && media.alt_text) {
          // Check if the current Alt text is different from the media Alt text
          if (currentAlt !== media.alt_text) {
            wp.data
              .dispatch("core/block-editor")
              .updateBlockAttributes(selectedBlock.clientId, {
                alt: media.alt_text,
              });
          }
        }
      }
    }
  });
});
