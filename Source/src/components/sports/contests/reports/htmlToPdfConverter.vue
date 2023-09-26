<template>
    <div>
        <form>
          <div class="html-to-pdf-controls">
            <div class="html-to-pdf-controls--search">
              <span class="html-to-pdf-controls--searchIcon"><v-icon>search</v-icon></span>
              <input type="text" placeholder="Search" v-model="searchValue"/>
            </div>
            <div v-if="displayShowEntires" class="html-to-pdf-control--select-rows">
              <label for="select-rows">Show</label>
              <select name="select-rows" id="select-rows" v-model="showNoRows">
                <option value="">All</option>
                <option value="1">1</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>Entries</span>
            </div>
            <div @click="exportToPDF" class="html-to-pdf-controls--pdf">
              <span>PDF</span>
              <span class="html-to-pdf-controls--pdfIcon"></span>
            </div>
          </div>
        </form>
        <div id="element-to-convert">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import html2pdf from 'html2pdf.js'
import moment from 'moment'

export default {
  props: {
    fileName: {
      type: String,
      required: true
    },
    searchKeyword: {
      type: String
    },
    showEntries: {
      type: String
    },
    displayShowEntires: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    searchValue: {
      get () {
        return this.searchKeyword
      },
      set (value) {
        this.$emit('update-search-keyword', value)
      }
    },
    showNoRows: {
      get () {
        return this.showEntries
      },
      set (value) {
        this.$emit('update-show-entries', value)
      }
    }
  },
  methods: {
    exportToPDF () {
      html2pdf(document.getElementById('element-to-convert'), { margin: 1, filename: `${this.fileName + ' ' + moment(new Date()).format('MM/DD/YYYY hh:mm:ss')}.pdf` })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

#element-to-convert
  overflow-x: auto
.html-to-pdf-controls
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom 10px
  color #4298b4
  .html-to-pdf-controls--search
    flex-grow: 1
    display: flex
    align-items: center
    border 1px solid #4298b4
    border-radius: 3px
    max-width: 500px
    .html-to-pdf-controls--searchIcon
      padding-left 5px
      i
        color: #4298b4
    input
      width: 100%
      appearance: none
      outline: none
      padding 3px 5px
    input::placeholder
      color #4298b4
      font-weight 900
  .html-to-pdf-control--select-rows
    label
      font-size 12px
    select
      appearance: auto
      padding 3px 20px
      border 1px solid #4298b4
      color: #4298b4
      border-radius: 3px
      outline: none
    @media mobile-big-and-below
      display: none
  .html-to-pdf-controls--pdf
    color #4298b4
    cursor: pointer
    padding 3px 12px
    display: flex
    align-items: center
    .html-to-pdf-controls--pdfIcon
      display: inline-block
      background-image: url(icons-path'/'contest_pdf_icon'.svg')
      height: 17px
      width: 17px
    span
      font-weight 900
      margin-right 5px
</style>