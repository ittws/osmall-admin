import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () =>
        import ('@/views/login.vue')
};
export const printRouter = {
    path: '/print',
    name: 'print',
    meta: {
        title: 'Print - 打印'
    },
    component: () =>
        import ('@/views/print.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () =>
        import ('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () =>
        import ('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () =>
        import ('@/views/error-page/500.vue')
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: () =>
        import ('@/views/form/article-publish/preview.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () =>
        import ('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [{
            path: 'home',
            title: {
                i18n: 'home'
            },
            name: 'home_index',
            component: () =>
                import ('@/views/home/home.vue')
        },
        {
            path: 'ownspace',
            title: '个人中心',
            name: 'ownspace_index',
            component: () =>
                import ('@/views/own-space/own-space.vue')
        },
        {
            path: 'shopping',
            title: '购物详情',
            name: 'shopping',
            component: () =>
                import ('@/views/advanced-router/component/shopping-info.vue')
        }, // 用于展示带参路由
        {
            path: 'message',
            title: '消息中心',
            name: 'message_index',
            component: () =>
                import ('@/views/message/message.vue')
        },
        {
            path: 'memberedit/:memberCardNo',
            name: 'memberedit',
            title: '会员编辑',
            component: () =>
                import ('@/views/member/member-add.vue')
        },
        {
            path: 'memberdetail',
            name: 'memberdetail',
            title: '会员详情',
            component: () =>
                import ('@/views/member/member-detail.vue')
        },
        {
            path: 'merchantedit/:merchantId',
            name: 'merchantedit',
            title: '商户编辑',
            component: () =>
                import ('@/views/merchant/merchant-add.vue')
        },
        {
            path: 'couponedit/:couponName',
            name: 'couponedit',
            title: '编辑优惠券',
            component: () =>
                import ('@/views/marketing/coupon-add.vue')
        },
        {
            path: 'couponadd',
            name: 'couponadd',
            title: '新增优惠券',
            component: () =>
                import ('@/views/marketing/coupon-add.vue')
        },
        {
            path: 'productgroupadd',
            name: 'productgroupadd',
            title: '新增商品组',
            component: () =>
                import ('@/views/product/product-group-add.vue')
        },
        {
            path: 'productgroupedit',
            name: 'productgroupedit',
            title: '编辑商品组',
            component: () =>
                import ('@/views/product/product-group-add.vue')
        },
        {
            path: 'adadd',
            name: 'adadd',
            title: '新增广告',
            component: () =>
                import ('@/views/marketing/ad-add.vue')
        },
        {
            path: 'adedit',
            name: 'adedit',
            title: '编辑广告',
            component: () =>
                import ('@/views/marketing/ad-add.vue')
        },
        {
            path: 'coupondata',
            name: 'coupondata',
            title: '优惠券领取详情',
            component: () =>
                import ('@/views/marketing/coupon-data.vue')
        },
        {
            path: 'seckilladd',
            name: 'seckilladd',
            title: '新增秒杀活动',
            component: () =>
                import ('@/views/marketing/seckill-add.vue')
        },
        {
            path: 'seckilledit',
            name: 'seckilledit',
            title: '编辑秒杀活动',
            component: () =>
                import ('@/views/marketing/seckill-add.vue')
        },
        {
            path: 'groupbuyadd',
            name: 'groupbuyadd',
            title: '新增团购活动',
            component: () =>
                import ('@/views/marketing/groupbuy-add.vue')
        },
        {
            path: 'groupbuyedit',
            name: 'groupbuyedit',
            title: '编辑秒团购活动',
            component: () =>
                import ('@/views/marketing/groupbuy-add.vue')
        },
        {
            path: 'activityadd',
            name: 'activityadd',
            title: '新增营销活动',
            component: () =>
                import ('@/views/marketing/activity-add.vue')
        },
        {
            path: 'activityedit',
            name: 'activityedit',
            title: '编辑营销活动',
            component: () =>
                import ('@/views/marketing/activity-add.vue')
        },
        {
            path: 'activitydata',
            name: 'activitydata',
            title: '营销活动数据',
            component: () =>
                import ('@/views/marketing/activity-data.vue')
        },
        {
            path: 'productadd',
            name: 'productadd',
            title: '录入商品',
            component: () =>
                import ('@/views/product/product-add.vue')
        },
        {
            path: 'productedit',
            name: 'productedit',
            title: '编辑商品',
            component: () =>
                import ('@/views/product/product-edit.vue')
        },
        {
            path: 'pointproductadd',
            name: 'pointproductadd',
            title: '录入积分商品',
            component: () =>
                import ('@/views/point/point-product-add.vue')
        },
        {
            path: 'pointproductedit',
            name: 'pointproductedit',
            title: '编辑积分商品',
            component: () =>
                import ('@/views/point/point-product-edit.vue')
        },
        {
            path: 'shippingedit',
            name: 'shippingedit',
            title: '编辑运费模板',
            component: () =>
                import ('@/views/product/shipping-add.vue')
        },
        {
            path: 'shippingadd',
            name: 'shippingadd',
            title: '新增运费模板',
            component: () =>
                import ('@/views/product/shipping-add.vue')
        },
        {
            path: 'orderdetail',
            name: 'orderdetail',
            title: '订单详情',
            component: () =>
                import ('@/views/order/order-detail.vue')
        },
        {
            path: 'stationdetail',
            name: 'stationdetail',
            title: '驿站详情',
            component: () =>
                import ('@/views/station/station-detail.vue')
        },
        {
            path: 'stationachievement',
            name: 'stationachievement',
            title: '驿站业绩',
            component: () =>
                import ('@/views/station/station-achievement.vue')
        },
        {
            path: 'articleadd',
            name: 'articleadd',
            title: '发布文案',
            component: () =>
                import ('@/views/content/article-add.vue')
        },
        {
            path: 'articleedit',
            name: 'articleedit',
            title: '修改文案',
            component: () =>
                import ('@/views/content/article-add.vue')
        },
        {
            path: 'articlepreview',
            name: 'articlepreview',
            title: '预览文案',
            component: () =>
                import ('@/views/content/article-preview.vue')
        },
        {
            path: 'audioadd',
            name: 'audioadd',
            title: '发布课程',
            component: () =>
                import ('@/views/content/audio-add.vue')
        },
        {
            path: 'audiopreview',
            name: 'audiopreview',
            title: '预览课程',
            component: () =>
                import ('@/views/content/audio-preview.vue')
        },
        {
            path: 'vedioadd',
            name: 'vedioadd',
            title: '发布视频',
            component: () =>
                import ('@/views/content/vedio-add.vue')
        },
        {
            path: 'vediopreview',
            name: 'vediopreview',
            title: '预览视频',
            component: () =>
                import ('@/views/content/vedio-preview.vue')
        },
        {
            path: 'swiperedit',
            name: 'swiperedit',
            title: '轮播图链接内容',
            component: () =>
                import ('@/views/marketing/swiper-edit.vue')
        },
        {
            path: 'qaadd',
            name: 'qaadd',
            title: '发布问答',
            component: () =>
                import ('@/views/content/qa-add.vue')
        },
        {
            path: 'qaedit',
            name: 'qaedit',
            title: '修改问答',
            component: () =>
                import ('@/views/content/qa-add.vue')
        },
        {
            path: 'qapreview',
            name: 'qapreview',
            title: '预览问题',
            component: () =>
                import ('@/views/content/qa-preview.vue')
        },
        {
            path: 'announcementadd',
            name: 'announcementadd',
            title: '发布通知',
            component: () =>
                import ('@/views/content/announcement-add.vue')
        },
        {
            path: 'announcementedit',
            name: 'announcementedit',
            title: '修改通知',
            component: () =>
                import ('@/views/content/announcement-add.vue')
        },
        {
            path: 'noticeadd',
            name: 'noticeadd',
            title: '发布通知',
            component: () =>
                import ('@/views/content/notice-add.vue')
        },
        {
            path: 'noticeedit',
            name: 'noticeedit',
            title: '发布通知',
            component: () =>
                import ('@/views/content/notice-add.vue')
        },
        {
            path: 'fundaccountedit/:accountNo',
            name: 'fundaccountedit',
            title: '编辑资金账户',
            component: () =>
                import ('@/views/fund/fund-account-add.vue')
        },
        {
            path: 'trainerdetail',
            name: 'trainerdetail',
            title: '培训导师详情',
            component: () =>
                import ('@/views/member/trainer-detail.vue')
        },

    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [{
        path: '/member',
        icon: 'person',
        name: 'member',
        title: '会员',
        component: Main,
        children: [{
                path: 'memberlevel',
                name: 'memberlevel',
                title: '会员等级',
                component: () =>
                    import ('@/views/member/member-level.vue')
            }, {
                path: 'memberlist',
                name: 'memberlist',
                title: '会员查询',
                component: () =>
                    import ('@/views/member/member-list.vue')
            },
            {
                path: 'trainerlist',
                name: 'trainerlist',
                title: '培训导师',
                component: () =>
                    import ('@/views/member/trainer-list.vue')
            }
        ]
    },
    {
        path: '/station',
        icon: 'ios-home',
        name: 'station',
        title: '商家',
        component: Main,
        children: [{
                path: 'merchantlist',
                name: 'merchantlist',
                title: '商家查询',
                component: () =>
                    import ('@/views/station/station-list.vue')
            },
            {
                path: 'stationapplication',
                name: 'stationapplication',
                title: '商家入驻审核',
                component: () =>
                    import ('@/views/station/station-application.vue')
            }
        ]
    }, {
        path: '/supplier',
        icon: 'outlet',
        name: 'supplier',
        title: '供应商',
        component: Main,
        children: [
        {
            path: 'supplierlist',
            name: 'supplierlist',
            title: '供应商查询',
            component: () =>
                import ('@/views/supplier/supplier-list.vue')
        }       
        ]
    }, {
        path: '/product',
        icon: 'pricetag',
        name: 'product',
        title: '商品',
        component: Main,
        children: [{
            path: 'producttypelist',
            name: 'producttypelist',
            title: '商品类目',
            component: () =>
                import ('@/views/product/product-type-list.vue')
        }, {
            path: 'productinsale',
            name: 'productinsale',
            title: '商品管理',
            component: () =>
                import ('@/views/product/product-list-insale.vue')
        }, {
            path: 'productgroup',
            name: 'productgroup',
            title: '商品组',
            component: () =>
                import ('@/views/product/product-group-list.vue')
        }, {
            path: 'productbrand',
            name: 'productbrand',
            title: '品牌管理',
            component: () =>
                import ('@/views/product/product-brand.vue')
        }, {
            path: 'comment',
            name: 'comment',
            title: '商品评论',
            component: () =>
                import ('@/views/product/comment-list.vue')
        }, {
            path: 'shippinglist',
            name: 'shippinglist',
            title: '运费模板',
            component: () =>
                import ('@/views/product/shipping-list.vue')
        }]
    }, {
        path: '/order',
        icon: 'ios-list',
        name: 'order',
        title: '订单',
        component: Main,
        children: [{
                path: 'orderlist',
                name: 'orderlist',
                title: '订单查询',
                component: () =>
                    import ('@/views/order/order-list.vue')
            },
            {
                path: 'aftersalelist',
                name: 'aftersalelist',
                title: '售后退款',
                component: () =>
                    import ('@/views/order/order-aftersale-list.vue')
            },
            {
                path: 'setting',
                name: 'setting',
                title: '订单设置',
                component: () =>
                    import ('@/views/order/order-setting.vue')
            }
        ]
    }, {
        path: '/fund',
        icon: 'social-yen',
        name: 'fund',
        title: '奖金',
        component: Main,
        children: [{
                path: 'userwithdraw',
                name: 'userwithdraw',
                title: '会员提现',
                component: () =>
                    import ('@/views/fund/user-withdraw.vue')
            },
            {
                path: 'merchantwithdraw',
                name: 'merchantwithdraw',
                title: '商家提现',
                component: () =>
                    import ('@/views/fund/merchant-withdraw.vue')
            },
            {
                path: 'fundreward',
                name: 'fundreward',
                title: '奖金支出',
                component: () =>
                    import ('@/views/fund/fund-reward.vue')
            },
            {
                path: 'fundperformance',
                name: 'fundperformance',
                title: '团队业绩',
                component: () =>
                    import ('@/views/fund/fund-performance.vue')
            },
            {
                path: 'withdrawsetting',
                name: 'withdrawsetting',
                title: '提现手续费',
                component: () =>
                    import ('@/views/fund/withdraw-setting.vue')
            }
        ]
    }, {
        path: '/point',
        icon: 'ionic',
        name: 'point',
        title: '积分',
        component: Main,
        children: [{
                path: 'sign-setting',
                name: 'sign-setting',
                title: '积分签到',
                component: () =>
                    import ('@/views/point/sign-setting.vue')
            }, {
                path: 'point-product-cate',
                name: 'point-product-cate',
                title: '积分类目',
                component: () =>
                    import ('@/views/point/point-product-cate-list.vue')
            }, {
                path: 'point-product',
                name: 'point-product',
                title: '积分商品',
                component: () =>
                    import ('@/views/point/point-product-list.vue')
            },
            {
                path: 'point-order-list',
                name: 'point-order-list',
                title: '积分订单',
                component: () =>
                    import ('@/views/point/point-order-list.vue')
            }
        ]
    }, {
        path: '/content',
        icon: 'ios-folder',
        name: 'content',
        title: '内容',
        component: Main,
        children: [{
                path: 'announcement',
                name: 'announcement',
                title: '官方资讯',
                component: () =>
                    import ('@/views/content/announcement-list.vue')
            },
            {
                path: 'notice',
                name: 'notice',
                title: '活动通知',
                component: () =>
                    import ('@/views/content/notice-list.vue')
            },
            {
                path: 'article',
                name: 'article',
                title: '素材管理',
                component: () =>
                    import ('@/views/content/article-list.vue')
            },
            {
                path: 'qa',
                name: 'qa',
                title: '常见问题',
                component: () =>
                    import ('@/views/content/qa-list.vue')
            }
        ]
    }, {
        path: '/marketing',
        icon: 'playstation',
        name: 'marketing',
        title: '营销推广',
        component: Main,
        children: [{
                path: 'swiper',
                name: 'swiper',
                title: '首页轮播',
                component: () =>
                    import ('@/views/marketing/swiper-list.vue')
            }, {
                path: 'ad',
                name: 'ad',
                title: '广告管理',
                component: () =>
                    import ('@/views/marketing/ad-list.vue')
            }, {
                path: 'couponlist',
                name: 'couponlist',
                title: '优惠券',
                component: () =>
                    import ('@/views/marketing/coupon-list.vue')
            },
            {
                path: 'seckillproduct',
                name: 'seckillproduct',
                title: '秒杀活动',
                component: () =>
                    import ('@/views/marketing/seckill-list.vue')
            },
            {
                path: 'groupbuyproduct',
                name: 'groupbuyproduct',
                title: '团购活动',
                component: () =>
                    import ('@/views/marketing/groupbuy-list.vue')
            }
        ]
    }, {
        path: '/analysis',
        icon: 'stats-bars',
        name: 'analysis',
        title: '统计分析',
        component: Main,
        children: [{
            path: 'operation',
            name: 'operation',
            title: '运营数据',
            component: () =>
                import ('@/views/analysis/analysis.vue')
        }]
    }, {
        path: '/application',
        icon: 'navicon-round',
        name: 'application',
        title: '应用设置',
        component: Main,
        children: [{
            path: 'base',
            name: 'base',
            title: '基础设置',
            component: () =>
                import ('@/views/application/base.vue')
        }, {
            path: 'wechat',
            name: 'wechat',
            title: '微信支付',
            component: () =>
                import ('@/views/application/wechat.vue')
        }, {
            path: 'alipay',
            name: 'alipay',
            title: '支付宝支付',
            component: () =>
                import ('@/views/application/alipay.vue')
        }, {
            path: 'oss',
            name: 'oss',
            title: '多媒体存储',
            component: () =>
                import ('@/views/application/oss.vue')
        }, {
            path: 'sms',
            name: 'sms',
            title: '短信设置',
            component: () =>
                import ('@/views/application/sms.vue')
        }, {
            path: 'application-print',
            name: 'application-print',
            title: '打印设置',
            component: () =>
                import ('@/views/application/print.vue')
        }, {
            path: 'application-courier',
            name: 'application-courier',
            title: '物流设置',
            component: () =>
                import ('@/views/application/courier.vue')
        }]
    }, {
        path: '/profit',
        icon: 'social-usd',
        name: 'profit',
        title: '分润设置',
        component: Main,
        children: [{
            path: 'distribution',
            name: 'distribution',
            title: '分销设置',
            component: () =>
                import ('@/views/profit/distribution.vue')
        }, {
            path: 'recruit',
            name: 'recruit',
            title: '推广分润',
            component: () =>
                import ('@/views/profit/recruit.vue')
        }, {
            path: 'sale',
            name: 'sale',
            title: '销售分润',
            component: () =>
                import ('@/views/profit/sale.vue')
        }, {
            path: 'performance',
            name: 'performance',
            title: '团队业绩分润',
            component: () =>
                import ('@/views/profit/performance.vue')
        }, {
            path: 'trainer',
            name: 'trainer',
            title: '培训分润',
            component: () =>
                import ('@/views/profit/trainer.vue')
        }]
    }, {
        path: '/system',
        icon: 'settings',
        name: 'system',
        title: '系统管理',
        component: Main,
        children: [{
                path: 'user',
                name: 'user',
                title: '账号管理',
                component: () =>
                    import ('@/views/sys/user-list.vue')
            },
            {
                path: 'role',
                name: 'role',
                title: '权限管理',
                component: () =>
                    import ('@/views/sys/role-list.vue')
            },
            {
                path: 'log',
                name: 'log',
                title: '系统日志',
                component: () =>
                    import ('@/views/sys/log-list.vue')
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    printRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];