export const ajaxRoleListData = [{
                name: '运营人员',
                description: '运营人员',
                functions:[{
                    functionName:'会员管理'
                },
                {
                    functionName:'驿站管理'
                },
                {
                    functionName:'订单管理'
                },
                {
                    functionName:'资金管理'
                },
                {
                    functionName:'内容管理'
                },]
            },
            {
                name: '系统管理员',
                description: '系统管理员',
                functions:[{
                    functionName:'系统管理'
                }]
            }];

export const ajaxPermissionListData = [{
    applicationName: '会员',
    functions: [{
            functionName: '会员概览',
            functionDescription: '会员概览'
        },{
            functionName: '会员查询',
            functionDescription: '会员查询'
        }]
    },
    {
        applicationName: '资金',
        functions: [{
            functionName: '资金概览',
            functionDescription: '资金概览'
        },{
            functionName: '提现记录',
            functionDescription: '提现记录'
        },{
            functionName: '奖金支出',
            functionDescription: '奖金支出'
        },{
            functionName: '退款申请',
            functionDescription: '退款申请'
        }]
    },
    {
        applicationName: '驿站',
        functions: [{
            functionName: '驿站查询',
            functionDescription: '驿站查询'
        },{
            functionName: '驿站审核',
            functionDescription: '驿站审核'
        }]
    },
    {
        applicationName: '订单',
        functions: [{
            functionName: '销售概览',
            functionDescription: '销售概览'
        },{
            functionName: '订单查询',
            functionDescription: '订单查询'
        },{
            functionName: '提货记录',
            functionDescription: '提货记录'
        }]
    },
    {
        applicationName: '内容',
        functions: [{
            functionName: '官方资讯',
            functionDescription: '官方资讯'
        },{
            functionName: '素材管理',
            functionDescription: '素材管理'
        },{
            functionName: '常见问题',
            functionDescription: '常见问题'
        }]
    },
    {
        applicationName: '系统管理',
        functions: [{
            functionName: '账户管理',
            functionDescription: '账户管理'
        },{
            functionName: '权限管理',
            functionDescription: '权限管理'
        },{
            functionName: '参数设置',
            functionDescription: '参数设置'
        }]
    }];