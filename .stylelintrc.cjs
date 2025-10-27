module.exports = {
    extends: ["stylelint-config-standard-scss"],
    plugins: ["stylelint-order"],
    rules: {
        "order/properties-order": [],
        "color-hex-length": "short",
        "max-nesting-depth": 3,
        "scss/at-use-no-unnamespaced": null,
        "selector-class-pattern": null
    }
};