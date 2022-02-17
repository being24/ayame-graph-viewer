flatpickr("#flatpickr", {
    locale:"ja",
    maxDate:"today",
    mode: "range"
})

const flatpickrElement = document.getElementById("flatpickr")
flatpickrElement.addEventListener("change", () => {
    flatpickrElement.value = flatpickrElement.value.replace('から', 'to')
})