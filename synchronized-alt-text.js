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

  function updateBlockAltText(block) {
    var imgId = block.attributes.id;
    var currentAlt = block.attributes.alt;
    if (imgId && !currentAlt) {
      var media = wp.data.select("core").getMedia(imgId);
      if (media && media.alt_text) {
        wp.data
          .dispatch("core/block-editor")
          .updateBlockAttributes(block.clientId, { alt: media.alt_text });
      }
    }
  }

  wp.data.subscribe(function () {
    var selectedBlock = wp.data.select("core/block-editor").getSelectedBlock();
    if (selectedBlock && selectedBlock.name === "core/image") {
      updateBlockAltText(selectedBlock);
    }
  });

  wp.hooks.addAction(
    "editor.BlockListBlock.onClick",
    "my-plugin/synchronized-alt-text",
    function (block) {
      if (block && block.name === "core/image") {
        updateBlockAltText(block);
      }
    }
  );
});
