import io, pycurl, json, pysolr, random
from collections import Counter

from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .forms import SearchForm
from highcharts.views import HighChartsBarView

def search_form(request):
    if request.method == 'POST':
        form = SearchForm(request.POST)
        #if form.is_valid():
        print("YO babes working")
        print(request.POST.get('search_field'))
        query = request.POST.get('search_field')
        template_set = True
        var_list = (1,2,3,4,10)
        '''
        response = io.BytesIO()
        c=pycurl.Curl()
        q="+".join(q.split())
        c.setopt(c.URL, 'http://localhost:8983/solr/gettingstarted/select?q='+q+'&wt=json&indent=true')
        c.setopt(c.WRITEDATA, response)
        c.perform()
        c.close()
        result = response.getvalue().decode("UTF-8")
        '''
        #Using solr
        solr = pysolr.Solr('http://localhost:8983/solr/gettingstarted/', timeout=10)
        results = solr.search(query, **{'wt':'json'})
        #print(results)
        result = results.__dict__
        #print(result['docs'])

        def create_trends(results, trend_query_parameter):
            #print(results[0])
            for doc in results:

                print("YOOUUOHOOOO")
                if trend_query_parameter in doc:
                    #print(json.dumps(doc,indent=4))
                    print(doc[trend_query_parameter])

                if 'coordinates' in doc:
                    print("Coordinate: ",doc['coordinates'])

            return Counter((doc[trend_query_parameter][0] for doc in results if trend_query_parameter in doc))

        #result['location_trends'] = create_trends(result['docs'], 'user.location')
        print(create_trends(result['docs'], 'user.time_zone'))
        num_results = len(results)
        print(num_results)
        #result['chart_data'] = BarView()
        #return render(request, 'search_ui/search_form.haml', {'query': query, 'result': result, 'num_results': num_results})
        return HttpResponse(json.dumps({'result' : result}))
        #return render(request, results)
        #else:
        #    print("Form invalid")
    else:
        print("post method shayad ")
        print(request)
        form = SearchForm()
    return render(request, 'search_ui/search_display.html', {'form': form})


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

