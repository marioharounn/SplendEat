"""splendeat URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework import routers, permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from api.views import (
  AuthView,
  CategoryItemsView,
  CategoryView,
  CommentView,
  RatingView,
  RecipeView,
  UserView,

)


apiRouter = routers.DefaultRouter()
apiRouter.register(r'recipes', RecipeView, 'recipe')
apiRouter.register(r'ratings', RatingView, 'rating')
apiRouter.register(r'comments', CommentView, 'comment')
apiRouter.register(r'categories', CategoryView, 'category')
apiRouter.register(r'categories/(?P<name>[^/]+)/recipes', CategoryItemsView, 'category_items')
apiRouter.register(r'user', UserView, 'user')
apiRouter.register(r'auth', AuthView, 'login')

apidocs_view = get_schema_view(
    openapi.Info(
        title="SplendEats API",
        default_version='v1',
        description="Dev manual for the REST API",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(apiRouter.urls)),
    path(r'apidocs', apidocs_view.with_ui(
        'swagger', cache_timeout=0), name='schema-swagger-ui'),
    path(r'apidocs/redoc', apidocs_view.with_ui('redoc',
         cache_timeout=0), name='schema-redoc'),
    path('', TemplateView.as_view(template_name='root.html')),
]

urlpatterns += static(settings.MEDIA_URL,
                      document_root=settings.MEDIA_ROOT)
urlpatterns += [path('<path:path>', TemplateView.as_view(template_name='root.html'))]
    
