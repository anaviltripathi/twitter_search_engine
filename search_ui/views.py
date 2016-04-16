import io, pycurl, json, pysolr, random
from collections import Counter

from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from search_ui.text_preprocessing import tokenize_all_tweets
from .forms import SearchForm
from highcharts.views import HighChartsBarView

#import text_preprocessing



def search_form(request):
    if request.method == 'POST':
        #form = SearchForm(request.POST)
        #if form.is_valid():
        print("YO babes working")
        print(request)
        print(request.POST.get('search_field'))
        query = request.POST.get('search_field')
        template_set = True
        var_list = (1,2,3,4,10)
        #Using solr
        solr = pysolr.Solr('http://localhost:8983/solr/gettingstarted/', timeout=10)
        results = solr.search(query, **{'wt':'json','rows':10000})
        result = results.__dict__
        tweets = [tweet_data['text'][0] for tweet_data in result['docs']]
        result['recommendations'] = tokenize_all_tweets(tweets)

        def create_trends(results, trend_query_parameter):
            return Counter((doc[trend_query_parameter][0] for doc in results if trend_query_parameter in doc))

        result['location_trends'] = create_trends(result['docs'], 'user.time_zone')

        count, page = 0, []
        for tweet_data in result['docs']:
            page.append(tweet_data)
            if count==7:


        num_results = len(results)
        return HttpResponse(json.dumps({'result' : result}))
    else:
        print("post method shayad ")
        print(request)
        form = SearchForm()
    return render(request, 'search_ui/search_display.haml', {'form': form})


def search(request):
    error = False

#     if 'q' in request.GET:
#         print("YIPEEEE")
#
#
#
#     return render(request, 'search_ui/search_form.haml',
#         {'error': error})

# Create your views here.

class BarView(HighChartsBarView):
    categories = ['Orange', 'Bananas', 'Apples']

    @property
    def series(self):
        result = []
        for name in ('Joe', 'Jack', 'William', 'Averell'):
            data = []
            for x in range(len(self.categories)):
                data.append(random.randint(0, 10))
            result.append({'name': name, "data": data})
        return result

def display_tweet(request):
    print("request is coming to display tweet")
    if request.method == 'GET':
        id = request.GET.get('q')
        print(id)
        solr = pysolr.Solr('http://localhost:8983/solr/gettingstarted/', timeout=10)
        results = solr.search("id:"+id, **{'wt':'json'})
        results=results.__dict__
        tweet_data=results['docs'][0]
        new_tweet={}
        bad_chars="'[]"
        for k, v in tweet_data.items():
            newkey=str(k).replace('.', '_')
            v=str(v)
            for c in bad_chars: v = v.replace(c, "")
            new_tweet[newkey]=v

        return render(request, 'search_ui/display.haml', {'result':new_tweet})

