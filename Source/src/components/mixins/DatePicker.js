import moment from 'moment'
export default {
  data: () => ({
    dateOfBirth: null,
    datePickerMenu: false
  }),
  computed: {
    maxDate () {
      let result = new Date().toISOString().substr(0, 10)

      if (this.brandKey === 'sb') {
        let currentYear = new Date().getFullYear()
        result = (currentYear - 20).toString()
      }

      return result
    },
    formattedDate () {
      return this.dateOfBirth ? moment(this.dateOfBirth).format('MM/DD/YYYY') : undefined // Custom format
    }
  },
  methods: {
    onDateBirth () {
      let state = ''
      let sbAndDateOfBirthPopulated = 1
      let sbAndDateOfBirthNotPopulated = 2

      let selectedYear = ''

      // cases
      if (this.brandKey === 'sb' && this.dateOfBirth) state = sbAndDateOfBirthPopulated
      if (this.brandKey === 'sb' && !this.dateOfBirth) state = sbAndDateOfBirthNotPopulated

      switch (state) {
        case sbAndDateOfBirthPopulated:
          selectedYear = this.dateOfBirth.split('-')[0]
          break
        case sbAndDateOfBirthNotPopulated:
          selectedYear = '1995'
          break
        default:
      }
      // scroll to year
      if (selectedYear) {
        setTimeout(() => {
          let datePickerElement = document.querySelector('.v-date-picker-years')
          if (datePickerElement && datePickerElement.hasChildNodes()) {
            let position = 0
            let children = datePickerElement.children

            for (var i = 0; i < children.length; i++) {
              let text = children[i].innerText || children[i].textContent
              if (text === selectedYear) {
                position = children[i].offsetTop
                break
              }
            }

            datePickerElement.scrollTop = position
          }
        }, 500)
      }
    },
    checkDateOfBirth () {
      this.$refs.datePickerMenu.save(this.dateOfBirth)
      if (!this.dateOfBirth) {
        this.dateOfBirthError = true
      } else {
        this.dateOfBirthError = false
      }
    }
  },
  watch: {
    datePickerMenu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  }
}
