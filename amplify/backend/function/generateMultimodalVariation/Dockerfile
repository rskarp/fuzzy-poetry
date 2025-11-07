FROM public.ecr.aws/lambda/python:3.9

WORKDIR /var/task

COPY Pipfile ./

RUN yum update -y && \
    yum install -y cmake

RUN pip install pipenv && \
    pipenv requirements > requirements.txt && \
    pip install -r requirements.txt --no-deps --target .

COPY . .

CMD ["src.index.handler"]