from django.shortcuts import render, redirect
from django.http import JsonResponse
import random

# Create your views here.

def mainPage(request):
    if request.method == "POST":
        try:
            startNum = int(request.POST.get('starting-number'))
            endNum = int(request.POST.get('ending-number'))

            if startNum >= endNum or startNum <= 0 or endNum <= 0:
                return render(request, 'raffles/main-page.html', {'error': "Invalid Input"})

            # Save the start and end numbers in session
            request.session['stored_start'] = startNum
            request.session['stored_end'] = endNum
            request.session['drawn_numbers'] = [] #clear any previous drawn numbers.

            #redirect to draw page
            return redirect('draw-page')
        except(ValueError, TypeError):
            return render(request, 'raffles/main-page.html', {'error': "Please enter valid numbers"})
        
    return render(request, 'raffles/main-page.html')


def drawPage(request):
    #Handles the draw and reset functionalities
    stored_start = request.session.get('stored_start')
    stored_end = request.session.get('stored_end')
    drawn_numbers = request.session.get('drawn_numbers', [])

    if not stored_start or not stored_end:
        #Return back to main page if no range is set
        return redirect('main-page')
    
    if request.method == "POST":
        number_pool = [n for n in range(stored_start, stored_end + 1) if n not in drawn_numbers]
        if not number_pool:
                return JsonResponse({'result': "All numbers have been drawn", 'all_drawn': True})
        else:
            #Handle the draw function
            result = random.choice(number_pool)
            drawn_numbers.append(result)
            request.session['drawn_numbers'] = drawn_numbers
            return JsonResponse({'result': result, 'all_drawn': False})
        
    drawn_numbers_str = ', '.join([str(n) for n in drawn_numbers])

    context = {
        'drawn_numbers': drawn_numbers_str,
        'stored_start': stored_start,
        'stored_end': stored_end
    }
    return render(request, 'raffles/draw.html', context)

def resetSession(request):
    if request.method in ['POST', 'GET']:
        print("Reset session")
        request.session['drawn_numbers'] = []
        request.session.pop('stored_start', None)
        request.session.pop('stored_end', None)
        return redirect('main-page')  # Redirect to main page on GET request
    return redirect('draw-page') # Redirect to draw page on GET request