import io, pycurl, json, pysolr

from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader


def search_form(request):
    return render(request, 'search_ui/search_form.haml')

def search(request):
    error = False
    if 'q' in request.GET:
        q = request.GET['q']
        if not q:
            error = True
        else:
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
            results = solr.search(q, **{'wt':'json'})
            print(results)
            result = results.__dict__
            num_results = len(results)
            
            return render(request, 'search_ui/search_results.haml', {'query': q, 'result': result, 'num_results': num_results})

    return render(request, 'search_ui/search_form.haml',
        {'error': error})

# Create your views here.
