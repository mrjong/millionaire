<template>
  <div class="invite-blank">
    <div class="img">
      <img v-webp="'invite-no-data.png'"/>
      <p>{{$t('invite.no_list_title')}}<br>{{$t('invite.no_list_text')}}</p>
    </div>
  </div>
</template>
<style scoped lang="less" type="text/less">
.invite-blank{
  width: 100%;
  height: 590px;
  position: relative;
  .img{
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    img {
      width: 232px;
      height: 207px;
      margin: 0 auto;
    }
    p {
      width: 100%;
      margin-top:40px;
      color: rgba(140, 140, 140, 0.7);
      font: 24px 'Roboto', Arial, serif;
      text-align: center;
    }
  }
}
</style>
<script>
export default {
  name: 'InviteBlank'
}
</script>
