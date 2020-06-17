export const ajaxMemberLevelListData = [{
                name: '联盟至尊卡会员',
                beginningBalance: 5000,
                saleAmount: 5000,
                conversionRatio: 0.5,
                discountRatio: 0.85,
                duration: 365,
                memo: '售卡金额为初次购买会员卡需缴纳的金额, 初始金额为购买后实际余额, 两者的差额决定是赚取还是补贴会员',
                chargeRules:[{
                    minAmount:5000,
                    maxAmount: 99999999,
                    rewardType:'固定金额',
                    rewardValue:300
                },
                {
                    minAmount:0,
                    maxAmount: 5000,
                    rewardType:'按充值比例',
                    rewardValue:'1%'
                }]
            },
            {
                name: '联盟金卡会员',
                beginningBalance: 0,
                saleAmount: 3000,
                conversionRatio: 0.5,
                discountRatio: 0.9,
                duration: 365,
                memo: '备注',
                chargeRules:[{
                    minAmount:5000,
                    maxAmount: 99999999,
                    rewardType:'固定金额',
                    rewardValue:200
                },
                {
                    minAmount:0,
                    maxAmount: 5000,
                    rewardType:'按充值比例',
                    rewardValue:'1%'
                }]
            },
            {
                name: '联盟银卡会员',
                beginningBalance: 0,
                saleAmount: 1000,
                conversionRatio: 0.5,
                discountRatio: 0.95,
                duration: 365,
                memo: '备注',
                chargeRules:[{
                    minAmount:5000,
                    maxAmount: 99999999,
                    rewardType:'固定金额',
                    rewardValue:100
                },
                {
                    minAmount:0,
                    maxAmount: 5000,
                    rewardType:'按充值比例',
                    rewardValue:'1%'
                }]
            }];