<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="24" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="修改密码" name="password">
                <up-password />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import upPassword from './components/upPassword'
import { getUser } from '@/utils/auth'

export default {
  name: 'Profile',
  components: { upPassword },
  data() {
    return {
      userInfo: getUser(),
      activeTab: 'password'
    }
  },
  computed: {
    // 通过Getters获得state里面的数据
    ...mapGetters([
      'user',
      'roles'
    ])
  },
  created() {
  },
  methods: {
  }
}
</script>
