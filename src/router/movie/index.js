export default {
    path: '/movie',
    component : () => import('@/views/Movie'),
    children : [
        {
            path : 'city',
            component : () => import('@/components/City')
        },
        {
            path : 'nowPlaying',
            component : () => import('@/components/NowPlaying')
        },
        {
            path : 'comingSoon',
            component : () => import('@/components/ComingSoon')
        },
        {
            path : 'search',
            component : () => import('@/components/Search')
        },
        {
            path : 'detail/1/:movieId',
            components : {
                default : ()=> import('@/components/NowPlaying'),   //默认指向router-view没有名字的组件
                detail : ()=> import('@/views/Movie/detail')
            },
            //通过props将$router与路由解耦
            props : {
                detail : true
            }
        },
        {
            path : 'detail/2/:movieId',
            components : {
                default : ()=> import('@/components/ComingSoon'),
                detail : ()=> import('@/views/Movie/detail')
            },
            //通过props将$router与路由解耦
            props : {
                detail : true
            }
        },
        {
            path : '/movie',
            redirect : '/movie/nowPlaying'
        },

    ]
}