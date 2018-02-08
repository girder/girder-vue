<template lang="pug">
transition(name="modal")
  .modal-mask
    .modal-wrapper
      .modal-container
        .modal-header
          slot(name="header")
        .modal-body
          slot(name="body")
        .modal-footer
          slot(name="footer")
</template>

<style lang="stylus" scoped>
/* TODO(zach) This should go away once we have a legitimate UI framework that provides its own dialog styling */
.modal-mask
  position fixed
  z-index 9998
  top 0
  left 0
  width 100%
  height 100%
  background-color rgba(0, 0, 0, .5)
  display table
  transition opacity .3s ease

.modal-wrapper
  display table-cell
  vertical-align middle

.modal-container
  width 300px
  margin 0px auto
  padding 20px 30px
  background-color #fff
  border-radius 2px
  box-shadow 0 2px 8px rgba(0, 0, 0, .33)
  transition all .3s ease

.modal-header h3
  margin-top 0
  color #42b983

.modal-body
  margin 20px 0

.modal-enter, .modal-leave-active
  opacity 0

.modal-enter .modal-container, .modal-leave-active .modal-container
  -webkit-transform scale(1.1)
  transform scale(1.1)
</style>
