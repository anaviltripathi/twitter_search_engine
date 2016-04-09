import io, pycurl, json, pysolr

from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .forms import SearchForm

def search_form(request):
    if request.method == 'POST':
        form = SearchForm(request.POST)
        #if form.is_valid():
        print("YO babes working")
        print(request.POST.get('search_field'))
        query = request.POST.get('search_field')
        template_set = True
        var_list = range(10)
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
        solr = pysolr.Solr('http://localhost:8983/solr/gettingstarted_shard1_replica1/', timeout=10)
        results = solr.search(query, **{'wt':'json'})
        #print(results)
        result = results.__dict__
        num_results = len(results)
        #return render(request, 'search_ui/search_form.haml', {'query': query, 'result': result, 'num_results': num_results})
        return HttpResponse(json.dumps({'result' : result}))
        #return render(request, results)
        #else:
        #    print("Form invalid")
    else:
        print("post method shayad")
        form = SearchForm()
    return render(request, 'search_ui/search_display.html', {'form': form})



def search(request):
    error = False
#
#     if 'q' in request.GET:
#         print("YIPEEEE")
#
#
#
#     return render(request, 'search_ui/search_form.haml',
#         {'error': error})

# Create your views here.

def display_tweet(request):
    print("request is coming to display tweet")
    #json_data=json.loads(request.body)
    # print(json_data)
    # print(json_data['x'])
    return render(request, 'search1/display.html')
