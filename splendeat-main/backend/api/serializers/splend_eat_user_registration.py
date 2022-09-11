from rest_framework.serializers import ModelSerializer, CharField, EmailField
from django.contrib.auth.hashers import make_password
from ..models import SplendEatUser

class SplendEatUserRegistrationSerializer(ModelSerializer):
    username = CharField(min_length=2, max_length=30)
    email = EmailField(required=False)
    password = CharField(
        style={'input_type': 'password'},
        min_length=8,
        max_length=200
    )

    class Meta:
        model = SplendEatUser
        fields = (
            'id',
            'username',
            'email',
            'password',
        )

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return super(SplendEatUserRegistrationSerializer, self).create(validated_data)
