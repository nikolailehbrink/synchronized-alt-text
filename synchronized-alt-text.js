wp.domReady(function () {
  function updateBlockAltText(clientId, media) {
    if (media && media.alt_text) {
      wp.data
        .dispatch("core/block-editor")
        .updateBlockAttributes(clientId, { alt: media.alt_text });
    }
  }

  wp.hooks.addFilter(
    "editor.BlockEdit",
    "my-plugin/synchronized-alt-text",
    function (BlockEdit) {
      return function (props) {
        var blockName = props.name;
        var attributes = props.attributes;

        if (blockName === "core/image") {
          var media = wp.data.select("core").getMedia(attributes.id);

          // Synchronize empty alt text automatically.
          if (!attributes.alt) {
            updateBlockAltText(props.clientId, media);
          }

          var syncAltTextLink = attributes.alt
            ? wp.element.createElement(
                "a",
                {
                  href: "#",
                  onClick: function (event) {
                    event.preventDefault();
                    media = wp.data.select("core").getMedia(attributes.id); // Fetch the latest media object
                    updateBlockAltText(props.clientId, media);
                  },
                  style: {
                    display: "block",
                    marginTop: "5px",
                    cursor: "pointer",
                    textDecoration: "underline",
                  },
                },
                "Synchronize Alt Text"
              )
            : null;

          var withInspectorControls = wp.compose.createHigherOrderComponent(
            function (BlockEdit) {
              return function (props) {
                return wp.element.createElement(
                  wp.element.Fragment,
                  {},
                  wp.element.createElement(BlockEdit, props),
                  wp.element.createElement(
                    wp.editor.InspectorControls,
                    {},
                    wp.element.createElement(
                      wp.components.PanelBody,
                      { title: "Alt Text Synchronization" },
                      syncAltTextLink
                    )
                  )
                );
              };
            },
            "withInspectorControls"
          );

          return withInspectorControls(BlockEdit)(props);
        } else {
          return wp.element.createElement(BlockEdit, props);
        }
      };
    }
  );
});
