from django import forms

class SearchForm(forms.Form):
    search_field = forms.CharField(label='Search Field', max_length=200)
